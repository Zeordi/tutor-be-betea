# TUTOR BE BETEA (በቤቴ) - Complete Platform

Teacher-Parent Connect Platform

## 📋 PROJECT OVERVIEW

Tutor Be Betea (በቤቴ) - meaning "At My Home" in Amharic, is a comprehensive platform connecting parents with verified local teachers for home-based tutoring. This complete implementation includes a modern web application, PWA mobile experience, and robust backend API.

## Structure

```
tutor-be-betea/
├── frontend/     # Next.js (App Router) + Tailwind
├── backend/      # NestJS + Prisma
├── docker/       # Compose, Dockerfiles, nginx
├── docs/         # API, deployment, guides
└── .github/      # CI / deploy workflows
```

## Quick start

```bash
# Backend
cd backend && cp .env.example .env && npm install && npx prisma migrate dev && npm run start:dev

# Frontend
cd frontend && cp .env.example .env.local && npm install && npm run dev

# Or with Docker
cd docker && docker compose up --build
```

## Roles

- **Parent** — search tutors, book sessions, message, favorites
- **Teacher** — profile, availability, bookings, earnings, verification
- **Admin** — verifications, users, disputes, analytics

## Deployment

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for environment variables, Docker Compose, CI/CD, and monitoring.

## License

MIT — see [LICENSE](./LICENSE).
