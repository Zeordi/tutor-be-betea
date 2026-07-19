# Deployment Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker (optional)

## Environment Variables

### Backend (`.env`)

```env
# Application
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/tutor_be_betea

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# Veriff
VERIFF_API_KEY=your-veriff-key
VERIFF_API_URL=https://api.veriff.com/v1

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=tutor-be-betea-docs

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890

# Google Maps
GOOGLE_MAPS_API_KEY=your-key
```

Copy from template:

```bash
cp backend/.env.example backend/.env
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_URL=https://api.yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret
```

Copy from template:

```bash
cp frontend/.env.example frontend/.env.local
```

## Docker Deployment

Compose file lives at `docker/docker-compose.yml` (Dockerfiles and nginx config are in the same folder).

```bash
cd docker
docker compose up --build -d
```

Services:

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000/api |
| Health check | http://localhost:4000/api/health |
| Nginx proxy | http://localhost:8080 |

Example production-oriented compose (see `docker/docker-compose.yml`):

```yaml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: tutor_user
      POSTGRES_PASSWORD: secure_password
      POSTGRES_DB: tutor_be_betea
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - tutor-network

  redis:
    image: redis:7-alpine
    networks:
      - tutor-network

  backend:
    build:
      context: ..
      dockerfile: docker/Dockerfile.backend
    environment:
      DATABASE_URL: postgresql://tutor_user:secure_password@postgres:5432/tutor_be_betea
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
    networks:
      - tutor-network

  frontend:
    build:
      context: ..
      dockerfile: docker/Dockerfile.frontend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:4000/api
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - tutor-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    networks:
      - tutor-network

volumes:
  postgres_data:

networks:
  tutor-network:
```

## Manual Deployment

```bash
# Backend
cd backend
npm ci
npx prisma migrate deploy
npm run build
npm run start:prod

# Frontend
cd frontend
npm ci
npm run build
npm start
```

## CI/CD Pipeline (GitHub Actions)

Workflow file: `.github/workflows/deploy.yml`

On push to `main` (or manual dispatch), the pipeline:

1. Checks out the repo
2. Sets up Node.js 18
3. Installs backend/frontend dependencies
4. Runs tests
5. Builds both apps
6. Deploys over SSH to the server and rebuilds Docker Compose

Required GitHub secrets:

- `SERVER_HOST`
- `SERVER_USER`
- `SERVER_SSH_KEY`

Server path used by the workflow: `/opt/tutor-be-betea`

## Monitoring

### Health Check

```http
GET /api/health
```

Example response:

```json
{
  "status": "ok",
  "service": "tutor-be-betea-backend",
  "timestamp": "2026-07-19T17:00:00.000Z"
}
```

### Logging

- Winston logger for application logs
- Sentry for error tracking (optional)
- Prometheus for metrics (optional)

### Performance

- Redis caching
- Database indexing (see Prisma schema)
- CDN for static assets
- Image optimization (Next.js)
