# Nova Player API Documentation

## Base URL

```
https://core.nova-player.fr
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

### Token Types

| Type | Expiration | Usage |
|------|------------|-------|
| Device | 24 hours | Device operations, playlist management |
| Reseller | 24 hours | Reseller operations, device activation |
| Admin | 7 days | Full system access |

---

## Device Endpoints

### Register Device

Create a new device registration.

```http
POST /device/register
```

**Request Body:**
```json
{
  "device_code": "ABC123XYZ",
  "pin": "123456"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Device registered successfully",
  "data": {
    "device": {
      "id": "uuid",
      "device_code": "ABC123XYZ",
      "status": "OPEN",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Authenticate Device

Authenticate with device code and PIN.

```http
POST /device/auth
```

**Request Body:**
```json
{
  "device_code": "ABC123XYZ",
  "pin": "123456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "device": {
      "device_code": "ABC123XYZ",
      "status": "ACTIVE",
      "lifetime": false,
      "trial": null,
      "activation": {
        "expires_at": "2024-12-31T23:59:59.000Z",
        "is_expired": false,
        "days_remaining": 365
      },
      "permissions": {
        "can_view_playlists": true,
        "can_add_playlists": true,
        "can_stream": true,
        "can_use_features": true
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Get Device Status

Get current device status (calculated server-side).

```http
GET /device/status?device_code=ABC123XYZ
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "device_code": "ABC123XYZ",
    "status": "TRIAL",
    "lifetime": false,
    "trial": {
      "started_at": "2024-01-01T00:00:00.000Z",
      "expires_at": "2024-01-08T00:00:00.000Z",
      "is_expired": false,
      "days_remaining": 5
    },
    "permissions": {
      "can_view_playlists": true,
      "can_add_playlists": true,
      "can_stream": true,
      "can_use_features": false
    }
  }
}
```

### ~~Start Trial~~ (REMOVED)

> **SECURITY**: The public trial endpoint has been removed. Trial can ONLY be started by:
> - Admin via `POST /admin/device/start-trial`
> - Reseller via `POST /reseller/device/start-trial`

This prevents abuse and ensures controlled trial distribution.

### Get Player Info

Get complete player information for IPTV apps.

```http
GET /device/player-info
Authorization: Bearer <device_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "device_code": "ABC123XYZ",
    "status": "ACTIVE",
    "lifetime": false,
    "trial": null,
    "activation": {
      "expires_at": "2024-12-31T23:59:59.000Z",
      "is_expired": false,
      "days_remaining": 365
    },
    "permissions": {
      "can_view_playlists": true,
      "can_add_playlists": true,
      "can_stream": true,
      "can_use_features": true
    },
    "playlists": [
      {
        "id": "uuid",
        "name": "My Playlist",
        "url": "http://example.com/playlist.m3u",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "server_time": "2024-01-15T12:00:00.000Z"
  }
}
```

---

## Playlist Endpoints

All playlist endpoints require device authentication.

### Get Playlists

```http
GET /device/playlists
Authorization: Bearer <device_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "playlists": [
      {
        "id": "uuid",
        "name": "My Playlist",
        "url": "http://example.com/playlist.m3u",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

### Add Playlist

```http
POST /device/playlists/add
Authorization: Bearer <device_token>
```

**Request Body:**
```json
{
  "name": "My Playlist",
  "url": "http://example.com/playlist.m3u"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Playlist added successfully",
  "data": {
    "id": "uuid",
    "name": "My Playlist",
    "url": "http://example.com/playlist.m3u",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Delete Playlist

```http
DELETE /device/playlists/:id
Authorization: Bearer <device_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Playlist deleted successfully"
}
```

---

## Reseller Endpoints

### Login

```http
POST /reseller/login
```

**Request Body:**
```json
{
  "email": "reseller@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "reseller": {
      "id": "uuid",
      "email": "reseller@example.com",
      "credits": 100
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Get Profile

```http
GET /reseller/profile
Authorization: Bearer <reseller_token>
```

### Activate Device

```http
POST /reseller/device/activate
Authorization: Bearer <reseller_token>
```

**Request Body:**
```json
{
  "device_code": "ABC123XYZ",
  "days": 30
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Device activated successfully",
  "data": {
    "device": { ... },
    "credits_remaining": 99
  }
}
```

### Start Device Trial

```http
POST /reseller/device/start-trial
Authorization: Bearer <reseller_token>
```

**Request Body:**
```json
{
  "device_code": "ABC123XYZ"
}
```

---

## Admin Endpoints

All admin endpoints require admin authentication.

### Login

```http
POST /admin/login
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

### Get System Stats

```http
GET /admin/stats
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "devices": {
      "total": 1000,
      "active": 500,
      "trial": 100,
      "expired": 400
    },
    "resellers": {
      "total": 50
    },
    "playlists": {
      "total": 2500
    }
  }
}
```

### Get All Devices

```http
GET /admin/devices?page=1&limit=50&status=ACTIVE
Authorization: Bearer <admin_token>
```

### Activate Device

```http
POST /admin/device/activate
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "device_code": "ABC123XYZ",
  "days": 365
}
```

Or for lifetime:
```json
{
  "device_code": "ABC123XYZ",
  "lifetime": true
}
```

### Expire Device

```http
POST /admin/device/expire
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "device_code": "ABC123XYZ"
}
```

### Batch Operations

**Start Trial (Batch - selected devices):**
```http
POST /admin/batch/start-trial
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "device_codes": ["ABC123", "DEF456", "GHI789"]
}
```

**Start Trial (ALL OPEN devices):**
```http
POST /admin/batch/start-trial-all
Authorization: Bearer <admin_token>
```

No request body required. Starts trial for all devices with status OPEN.

**Response:**
```json
{
  "success": true,
  "message": "Trial started for 50 devices",
  "data": {
    "total": 55,
    "success": ["ABC123", "DEF456", ...],
    "failed": [{"device_code": "XYZ789", "error": "Trial already used"}]
  }
}
```

**Expire (Batch):**
```http
POST /admin/batch/expire
Authorization: Bearer <admin_token>
```

**Activate (Batch):**
```http
POST /admin/batch/activate
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "device_codes": ["ABC123", "DEF456"],
  "days": 30
}
```

**Activate Lifetime (Batch):**
```http
POST /admin/batch/activate-lifetime
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "device_codes": ["ABC123", "DEF456"]
}
```

### Create Reseller

```http
POST /admin/reseller/create
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "email": "newreseller@example.com",
  "password": "securepassword",
  "credits": 100
}
```

### Add Credits to Reseller

```http
POST /admin/reseller/credit
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "reseller_id": "uuid",
  "amount": 50
}
```

---

## Error Responses

### Validation Error (400)

```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "field": "device_code",
      "message": "Device code is required"
    }
  ]
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "error": "Unauthorized access"
}
```

### Not Found (404)

```json
{
  "success": false,
  "error": "Device not found"
}
```

### Rate Limited (429)

```json
{
  "success": false,
  "error": "Too many requests, please try again later",
  "retryAfter": 900
}
```

---

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| General | 100 requests | 15 minutes |
| `/device/status` | 100 requests | 15 minutes |
| `/reseller/login` | 5 attempts | 15 minutes |
| `/admin/login` | 5 attempts | 15 minutes |
| `/device/register` | 10 registrations | 1 hour |
| Admin endpoints | 1000 requests | 15 minutes |

> **Note**: Public trial endpoint removed for security. Trial limited to Admin/Reseller control.

---

## Status Codes

| Status | Description |
|--------|-------------|
| `OPEN` | Device registered, not activated |
| `TRIAL` | Device in trial period |
| `ACTIVE` | Device actively licensed |
| `EXPIRED` | Trial or activation expired |
| `LIFETIME` | Device with lifetime activation |
