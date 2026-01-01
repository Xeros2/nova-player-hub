# Nova Player - Architecture Documentation

## System Overview

Nova Player is a licensing and activation system for IPTV players. It manages device registration, trial periods, paid activations, and reseller operations.

```
┌─────────────────────────────────────────────────────────────────┐
│                        IPTV Application                          │
│                    (Android, Fire TV, etc.)                       │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Nova Player API                               │
│                https://core.nova-player.fr                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Device  │  │ Playlist │  │ Reseller │  │  Admin   │        │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
├─────────────────────────────────────────────────────────────────┤
│                      Status Service                              │
│            (Server-side status calculation)                      │
├─────────────────────────────────────────────────────────────────┤
│                        Database                                  │
│               (MySQL / PostgreSQL)                               │
└─────────────────────────────────────────────────────────────────┘
```

## Core Concepts

### Device Status Lifecycle

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│  OPEN   │────▶│  TRIAL  │────▶│ EXPIRED │
└─────────┘     └─────────┘     └─────────┘
     │                               │
     │         ┌─────────┐           │
     └────────▶│ ACTIVE  │◀──────────┘
               └─────────┘
                    │
                    ▼
               ┌──────────┐
               │ LIFETIME │
               └──────────┘
```

| Status | Description | Permissions |
|--------|-------------|-------------|
| **OPEN** | Device registered but not activated | View only |
| **TRIAL** | In free trial period (30 days default) | Full access, limited features |
| **ACTIVE** | Paid subscription active | Full access |
| **EXPIRED** | Trial or subscription expired | View only, no streaming |
| **LIFETIME** | Permanent activation | Full access |

### Server-Side Status Calculation

**CRITICAL SECURITY FEATURE**: Device status is NEVER trusted from the client.

The status is calculated on every API request based on:

```javascript
function calculateStatus(device) {
  const now = new Date();
  
  // Priority 1: Lifetime
  if (device.lifetime === true) {
    return 'LIFETIME';
  }
  
  // Priority 2: Active subscription
  if (device.activated_until && device.activated_until > now) {
    return 'ACTIVE';
  }
  
  // Priority 3: Trial period
  if (device.trial_expires_at) {
    if (device.trial_expires_at > now) {
      return 'TRIAL';
    }
    return 'EXPIRED';
  }
  
  // Priority 4: Check expired activation
  if (device.activated_until && device.activated_until <= now) {
    return 'EXPIRED';
  }
  
  // Default
  return 'OPEN';
}
```

## Authentication Flow

### Device Authentication

```
┌──────────┐          ┌──────────┐          ┌──────────┐
│  Device  │          │   API    │          │    DB    │
└────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │
     │  POST /device/auth  │                     │
     │  {code, pin}        │                     │
     │────────────────────▶│                     │
     │                     │   Find device       │
     │                     │────────────────────▶│
     │                     │                     │
     │                     │   Device data       │
     │                     │◀────────────────────│
     │                     │                     │
     │                     │   Verify PIN (bcrypt)
     │                     │                     │
     │                     │   Calculate status  │
     │                     │                     │
     │                     │   Generate JWT      │
     │                     │                     │
     │  {device, token}    │                     │
     │◀────────────────────│                     │
     │                     │                     │
```

### JWT Token Structure

**Device Token:**
```json
{
  "type": "device",
  "deviceId": "uuid",
  "deviceCode": "ABC123",
  "iat": 1704067200,
  "exp": 1704153600
}
```

**Reseller Token:**
```json
{
  "type": "reseller",
  "resellerId": "uuid",
  "email": "reseller@example.com",
  "iat": 1704067200,
  "exp": 1704153600
}
```

**Admin Token (signed with separate secret):**
```json
{
  "type": "admin",
  "adminId": "admin",
  "role": "admin",
  "iat": 1704067200,
  "exp": 1704672000
}
```

## Trial Period Flow

> **SECURITY**: Trial can ONLY be started by Admin or Reseller.
> Public trial endpoint has been removed to prevent abuse.

```
┌────────────────────────────────────────────────────────────────┐
│                        TRIAL FLOW                               │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. User downloads app                                          │
│     └──▶ App displays device_code and PIN                       │
│                                                                 │
│  2. User registers device                                       │
│     └──▶ POST /device/register                                  │
│     └──▶ Status: OPEN                                           │
│                                                                 │
│  3. Admin or Reseller starts trial (NOT user)                   │
│     └──▶ POST /admin/device/start-trial                         │
│     └──▶ OR POST /reseller/device/start-trial                   │
│     └──▶ Status: TRIAL                                          │
│     └──▶ trial_started_at = now()                               │
│     └──▶ trial_expires_at = now() + 30 days                     │
│                                                                 │
│  4. Trial period active                                         │
│     └──▶ User can stream and manage playlists                   │
│     └──▶ Limited premium features                               │
│                                                                 │
│  5. Trial expires                                               │
│     └──▶ Status calculated: EXPIRED                             │
│     └──▶ User cannot stream                                     │
│     └──▶ Must purchase activation                               │
│                                                                 │
│  BLOCKED ACTIONS:                                               │
│     ✗ User cannot start trial themselves                        │
│     ✗ Trial cannot be restarted once used                       │
│     ✗ Trial cannot be extended from client                      │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

## Activation Flow

### Direct Activation (Admin)

```
Admin ──▶ POST /admin/device/activate
          {device_code, days: 365}
               │
               ▼
        Calculate expiration
        activated_until = now + 365 days
               │
               ▼
        Update device status
        Status: ACTIVE
```

### Reseller Activation

```
┌──────────────────────────────────────────────────────────────┐
│                    RESELLER FLOW                              │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Admin creates reseller                                    │
│     └──▶ POST /admin/reseller/create                          │
│     └──▶ {email, password, credits: 100}                      │
│                                                               │
│  2. Reseller logs in                                          │
│     └──▶ POST /reseller/login                                 │
│     └──▶ Returns JWT token                                    │
│                                                               │
│  3. Customer gives device_code to reseller                    │
│                                                               │
│  4. Reseller activates device                                 │
│     └──▶ POST /reseller/device/activate                       │
│     └──▶ {device_code, days: 30}                              │
│                                                               │
│  5. System calculates credit cost                             │
│     └──▶ 1 credit per 30 days                                 │
│                                                               │
│  6. Credits deducted, device activated                        │
│     └──▶ reseller.credits -= cost                             │
│     └──▶ device.activated_until = now + days                  │
│     └──▶ device.reseller_id = reseller.id                     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Security Measures

### 1. PIN Security

- PINs are hashed with bcrypt (12 salt rounds)
- Never stored or transmitted in plain text
- Compared server-side only

```javascript
// Hashing
const hash = await bcrypt.hash(pin, 12);

// Verification
const isValid = await bcrypt.compare(providedPin, storedHash);
```

### 2. JWT Security

- Tokens signed with HMAC-SHA256
- Separate secrets for admin vs user tokens
- Short expiration times
- Token type validation

```javascript
// Admin secret is different from user secret
const adminSecret = process.env.ADMIN_JWT_SECRET;
const userSecret = process.env.JWT_SECRET;
```

### 3. Rate Limiting

| Endpoint | Limit | Purpose |
|----------|-------|---------|
| Login | 5/15min | Prevent brute force |
| Registration | 10/hour | Prevent spam |
| Trial start | 3/hour | Prevent abuse |
| Status check | 100/15min | Prevent DDoS |

### 4. Input Validation

All inputs are validated with Joi schemas:

```javascript
const deviceRegister = Joi.object({
  device_code: Joi.string().min(4).max(50).required(),
  pin: Joi.string().min(4).max(20).required()
});
```

### 5. Anti-Piracy Measures

1. **Server-side status calculation**: Status cannot be faked
2. **Status check on app launch**: Must validate with server
3. **Token expiration**: Requires periodic re-authentication
4. **Device binding**: device_code tied to single device
5. **Trial controlled by Admin/Reseller only**: Users cannot start trials themselves
6. **Playlist access blocked when expired**: EXPIRED devices cannot view/add playlists
7. **Single trial per device**: Trial cannot be restarted once used

## Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                           DEVICES                                │
├─────────────────────────────────────────────────────────────────┤
│ id              UUID PRIMARY KEY                                 │
│ device_code     VARCHAR(50) UNIQUE NOT NULL                      │
│ pin_hash        VARCHAR(255) NOT NULL                            │
│ status          ENUM('OPEN','TRIAL','EXPIRED','ACTIVE','LIFETIME')
│ trial_started_at DATETIME                                        │
│ trial_expires_at DATETIME                                        │
│ activated_until  DATETIME                                        │
│ lifetime        BOOLEAN DEFAULT FALSE                            │
│ reseller_id     UUID REFERENCES resellers(id)                    │
│ created_at      DATETIME                                         │
│ updated_at      DATETIME                                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          PLAYLISTS                               │
├─────────────────────────────────────────────────────────────────┤
│ id              UUID PRIMARY KEY                                 │
│ device_id       UUID REFERENCES devices(id) ON DELETE CASCADE    │
│ name            VARCHAR(100) NOT NULL                            │
│ url             VARCHAR(2048) NOT NULL                           │
│ created_at      DATETIME                                         │
│ updated_at      DATETIME                                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          RESELLERS                               │
├─────────────────────────────────────────────────────────────────┤
│ id              UUID PRIMARY KEY                                 │
│ email           VARCHAR(255) UNIQUE NOT NULL                     │
│ password_hash   VARCHAR(255) NOT NULL                            │
│ credits         INTEGER DEFAULT 0                                │
│ is_active       BOOLEAN DEFAULT TRUE                             │
│ created_at      DATETIME                                         │
│ updated_at      DATETIME                                         │
└─────────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         PRODUCTION                              │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐                  │
│  │   Nginx/Caddy    │    │   Let's Encrypt  │                  │
│  │  (Reverse Proxy) │◀───│   (SSL/TLS)      │                  │
│  └────────┬─────────┘    └──────────────────┘                  │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────┐                                          │
│  │    PM2 Cluster   │                                          │
│  │  (Node.js x CPU) │                                          │
│  └────────┬─────────┘                                          │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────┐                                          │
│  │  MySQL/PostgreSQL│                                          │
│  │   (Database)     │                                          │
│  └──────────────────┘                                          │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

## Logging & Monitoring

All operations are logged with Winston:

```javascript
// Request logging
logger.info('Response sent', {
  method: 'POST',
  path: '/device/register',
  status: 201,
  duration: '45ms'
});

// Device operations
logger.logDevice('Activated', 'ABC123', {
  days: 365,
  reseller_id: 'uuid'
});

// Authentication
logger.logAuth('Login success', 'reseller@example.com');
```

Log files (production):
- `logs/combined.log` - All logs
- `logs/error.log` - Errors only
- `logs/exceptions.log` - Uncaught exceptions
