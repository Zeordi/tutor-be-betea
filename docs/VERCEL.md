# Vercel deployment

## Live URLs

| App | URL |
|-----|-----|
| Frontend | https://tutor-be-betea.vercel.app |
| API (project) | https://tutor-be-betea-api.vercel.app |

## Projects

- Frontend: `zeordis-projects/tutor-be-betea` (root: `frontend/`)
- Backend: `zeordis-projects/tutor-be-betea-api` (root: `backend/`)

## Database (required for API)

Neon marketplace terms must be accepted once in the browser:

1. Open: https://vercel.com/zeordis-projects/~/integrations/accept-terms/neon?source=cli
2. Accept Neon / Vercel marketplace terms
3. Then run:

```bash
cd frontend
npx vercel integration add neon --plan free_v3 -m region=iad1 -m auth=false --name tutor-be-betea-db -e production -e preview
npx vercel integration resource connect tutor-be-betea-db tutor-be-betea-api
```

Or from the Vercel dashboard: Storage → Create Database → Neon → connect to `tutor-be-betea-api`.

Then migrate:

```bash
cd backend
npx prisma db push
# or: npx prisma migrate deploy
```

## Redeploy

```bash
cd frontend && npx vercel --prod
cd backend && npx vercel --prod
```

## Notes

- Socket.IO chat is limited on Vercel serverless (HTTP API routes work; realtime WS may need a separate host).
- Set real `STRIPE_*`, email, and AWS keys in the Vercel project env when going live beyond demo.
