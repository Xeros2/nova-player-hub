# Nova Player - Multi-App Monorepo

VPS-ready deployment structure with 4 frontends + 1 backend.

## Structure

```
apps/
├── website/          # nova-player.fr (public site)
├── user-panel/       # panel.nova-player.fr
├── admin-panel/      # admin.nova-player.fr
├── reseller-panel/   # reseller.nova-player.fr
backend/              # core.nova-player.fr (API)
deploy/               # Nginx configs & scripts
```

## Quick Start

```bash
# Install all dependencies
npm install

# Dev - Website
npm run dev:website

# Dev - Backend
npm run dev:backend

# Build all
npm run build:all

# Deploy to VPS
npm run deploy
```

## Deployment

Each app builds to static files served by Nginx. The backend runs via PM2.

See `deploy/README.md` for VPS setup instructions.
