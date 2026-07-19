# Vercel deployment

## Live URLs

| App | URL |
|-----|-----|
| Frontend | https://tutor-be-betea.vercel.app |
| API (project) | https://tutor-be-betea-api.vercel.app |

## Projects

- Frontend: `zeordis-projects/tutor-be-betea` (root: `frontend/`)
- Backend: `zeordis-projects/tutor-be-betea-api` (root: `backend/`)

## Database

Neon Postgres resource **`tutor-be-betea-db`** is connected to:

- `tutor-be-betea` (frontend)
- `tutor-be-betea-api` (backend)

Schema applied via Prisma (`20260719190000_init`). Dashboard:

https://vercel.com/d/dashboard/integrations/neon/icfg_ftuxOhzYAV3O3bhlxzfMkd8X/resources/store_pznjCsOwcfX41Twu

To re-migrate locally (after `vercel env pull`):

```bash
cd backend
npx vercel env pull .env --environment=production --yes
npx prisma migrate deploy
```

## Redeploy

```bash
cd frontend && npx vercel --prod
cd backend && npx vercel --prod
```

## Notes

- Socket.IO chat is limited on Vercel serverless (HTTP API routes work; realtime WS may need a separate host).
- Set real `STRIPE_*`, email, and AWS keys in the Vercel project env when going live beyond demo.
