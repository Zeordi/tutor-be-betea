# Deployment

## Prerequisites

- Node.js 20+
- PostgreSQL 16
- Redis 7
- Docker (optional)

## Environment

Copy `backend/.env.example` → `backend/.env` and `frontend/.env.example` → `frontend/.env.local`.

Required secrets:

- `JWT_SECRET`, `NEXTAUTH_SECRET`
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `VERIFF_API_KEY`
- Email / S3 credentials as needed

## Docker

```bash
cd docker
docker compose up --build
```

- Frontend: http://localhost:3000
- API: http://localhost:4000/api
- Nginx: http://localhost:8080

## Manual

```bash
# Backend
cd backend
npm install
npx prisma migrate dev --schema=src/prisma/schema.prisma
npm run start:dev

# Frontend
cd frontend
npm install
npm run build && npm start
```

## CI/CD

See `.github/workflows/ci.yml` and `deploy.yml`.
