# API Overview

Base URL: `http://localhost:4000/api`

## Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Create parent or teacher account |
| POST | `/auth/login` | Issue JWT |
| POST | `/auth/reset-password` | Request / complete password reset |

## Users

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users/me` | Current user |
| PATCH | `/users/me` | Update profile |

## Teachers

| Method | Path | Description |
|--------|------|-------------|
| GET | `/teachers` | Search / list |
| GET | `/teachers/:id` | Profile |
| POST | `/teachers/profile` | Create teacher profile |
| PATCH | `/teachers/profile` | Update profile |
| GET/POST | `/teachers/verification` | Verification status / submit |
| GET/PUT | `/teachers/availability` | Weekly availability |

## Bookings & payments

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/bookings` | List / create |
| PATCH | `/bookings/:id` | Update status |
| POST | `/payments` | Create payment intent |
| POST | `/payments/refund` | Refund |
| POST | `/payments/webhooks/stripe` | Stripe webhook |

## Chat, reviews, admin

- WebSocket namespace: `/chat` — event `message`
- `POST /reviews`, `GET /reviews/teacher/:teacherId`
- Admin: `/admin/users`, `/admin/verifications`, `/admin/disputes`
