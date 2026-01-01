# Nova Player Backend API

Backend API complet pour le système de licensing IPTV Nova Player.

## 🚀 Installation

### Prérequis

- Node.js 18+
- MySQL 8+ ou PostgreSQL 14+
- npm ou yarn

### Installation des dépendances

```bash
cd backend
npm install
```

### Configuration

1. Copier le fichier d'environnement :

```bash
cp .env.example .env
```

2. Modifier les variables dans `.env` :

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://user:password@localhost:3306/nova_player
JWT_SECRET=votre-secret-jwt-unique
ADMIN_JWT_SECRET=votre-secret-admin-unique
```

### Migration de la base de données

La base de données est synchronisée automatiquement au démarrage.
Pour un environnement de production, utilisez les migrations Sequelize :

```bash
npm run db:migrate
```

### Démarrage

**Développement :**
```bash
npm run dev
```

**Production :**
```bash
npm start
```

## 📡 Endpoints API

### Device

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/device/register` | Enregistrer un nouvel appareil |
| GET | `/device/status` | Vérifier le statut d'un appareil |
| POST | `/device/activate` | Activer un appareil |
| POST | `/device/start-trial` | Démarrer une période d'essai |

### Playlist

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/device/playlists` | Lister les playlists |
| POST | `/device/playlists/add` | Ajouter une playlist |
| DELETE | `/device/playlists/:id` | Supprimer une playlist |

### Admin (JWT requis)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/admin/devices` | Lister tous les appareils |
| POST | `/admin/device/activate` | Activer un appareil |
| POST | `/admin/device/expire` | Expirer un appareil |
| POST | `/admin/device/start-trial` | Démarrer trial |
| POST | `/admin/batch/start-trial` | Trial en batch |
| POST | `/admin/batch/expire` | Expirer en batch |
| POST | `/admin/reseller/create` | Créer un reseller |
| POST | `/admin/reseller/credit` | Ajouter des crédits |

### Reseller

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/reseller/login` | Connexion reseller |
| POST | `/reseller/device/activate` | Activer un appareil |
| POST | `/reseller/device/start-trial` | Démarrer trial |

## 🔒 Sécurité

- **Statut calculé côté serveur** : Le statut n'est jamais stocké, toujours calculé dynamiquement
- **Hachage bcrypt** : PIN et mots de passe hashés avec bcrypt (12 rounds)
- **JWT signé** : Tokens avec expiration configurable
- **Rate limiting** : Protection contre les abus
- **Validation des entrées** : Toutes les entrées validées avec Joi

## 🏗️ Architecture

```
/src
  /controllers    # Logique des endpoints
  /routes         # Définition des routes
  /services       # Logique métier
  /models         # Modèles Sequelize
  /middlewares    # Auth, rate limit, validation
  /utils          # Constantes, logger
  app.js          # Configuration Express
  server.js       # Point d'entrée
```

## 📖 Documentation

- [Documentation API](./docs/api.md)
- [Architecture](./docs/architecture.md)

## 🧪 Tests

```bash
npm test
```

## 🚀 Déploiement

### Avec PM2

```bash
npm install -g pm2
pm2 start src/server.js --name nova-player-api
pm2 save
pm2 startup
```

### Avec Nginx (reverse proxy)

```nginx
server {
    listen 80;
    server_name core.nova-player.fr;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### HTTPS avec Certbot

```bash
sudo certbot --nginx -d core.nova-player.fr
```

## 📝 License

MIT
