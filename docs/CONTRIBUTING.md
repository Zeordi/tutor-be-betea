# Contributing

## Setup

1. Fork and clone the repo
2. Install frontend and backend dependencies
3. Start Postgres + Redis (or `docker compose up db redis`)
4. Run migrations and seed data

## Branching

- `main` — production-ready
- Feature branches: `cursor/<short-description>-xxxx` or `feat/<name>`

## Guidelines

- TypeScript strict mode
- Prefer small, focused PRs
- Add unit/e2e coverage for booking and payment flows
- Do not commit real secrets — use `.env.example` templates

## Pull requests

- Describe the change and how to test it
- Link related issues
- Ensure CI is green
