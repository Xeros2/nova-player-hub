# Nova Player - VPS Deployment Guide

## Prerequisites
- Ubuntu 22.04+ / Debian 12+
- Node.js 20+
- PostgreSQL 16+
- Nginx
- PM2

## Installation

```bash
# 1. Clone and build
git clone <repo> /var/www/nova-player
cd /var/www/nova-player
npm install
npm run build:all

# 2. Setup PostgreSQL
sudo -u postgres createdb nova_player

# 3. Configure backend
cd backend
cp .env.example .env
# Edit .env with your settings
npx prisma migrate deploy
npx prisma db seed

# 4. Start backend with PM2
pm2 start ecosystem.config.js
pm2 save

# 5. Configure Nginx
sudo cp deploy/nginx/*.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/*.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 6. Setup SSL (certbot)
sudo certbot --nginx -d nova-player.fr -d panel.nova-player.fr -d admin.nova-player.fr -d core.nova-player.fr
```

## Domains
- `nova-player.fr` → Website
- `panel.nova-player.fr` → User Panel
- `admin.nova-player.fr` → Admin Panel
- `reseller.nova-player.fr` → Reseller Panel
- `core.nova-player.fr` → API Backend
