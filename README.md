# tutor-be-betea

Marketplace platform connecting parents with tutors — Next.js frontend, NestJS backend, Prisma, Stripe, and real-time chat.

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

## License

MIT — see [LICENSE](./LICENSE).
