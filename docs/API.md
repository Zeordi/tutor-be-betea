# Tutor Be Betea API Documentation

## Base URL

```
http://localhost:4000/api
```

Interactive Swagger (planned): `http://localhost:4000/api/docs`

Unless noted otherwise, authenticated routes expect:

```http
Authorization: Bearer <accessToken>
```

---

## Authentication

### Register User

```http
POST /auth/register
```

Request body:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe",
  "phone": "+251912345678",
  "userType": "PARENT"
}
```

`userType` may be `PARENT`, `TEACHER`, or `ADMIN`.

Response:

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "userType": "PARENT",
    "isVerified": false
  },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "expiresIn": 900
}
```

### Login

```http
POST /auth/login
```

Request body:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

Response: same shape as register (`user`, `accessToken`, `refreshToken`, `expiresIn`).

### Refresh Token

```http
POST /auth/refresh
```

Request body:

```json
{
  "refreshToken": "refresh_token"
}
```

### Verify Email

```http
POST /auth/verify-email
```

Request body:

```json
{
  "token": "email_verification_token"
}
```

### Logout

```http
POST /auth/logout
Authorization: Bearer <accessToken>
```

---

## Users

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/users/me` | Yes | Current user profile |
| PATCH | `/users/me` | Yes | Update name/email |

---

## Teachers

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/teachers` | Optional | List/search teachers (`?q=`) |
| GET | `/teachers/:id` | Optional | Teacher profile by id |
| POST | `/teachers/profile` | Yes | Create teacher profile |
| PATCH | `/teachers/profile` | Yes | Update teacher profile |
| GET | `/teachers/verification` | Yes | Verification status |
| POST | `/teachers/verification` | Yes | Submit verification documents |
| GET | `/teachers/availability` | Yes | Get weekly availability |
| PUT | `/teachers/availability` | Yes | Set weekly availability slots |

---

## Bookings

### Create booking

```http
POST /bookings
Authorization: Bearer <accessToken>
```

Request body:

```json
{
  "teacherId": "uuid",
  "bookingDate": "2026-07-20",
  "startTime": "09:00",
  "endTime": "10:00",
  "studentName": "Abebe",
  "studentAge": 12,
  "learningGoals": "Improve math fundamentals",
  "isTrialLesson": false
}
```

### Confirm / complete / cancel

| Method | Path | Role | Description |
|--------|------|------|-------------|
| POST | `/bookings/:id/confirm` | Teacher | Confirm booking + create Stripe payment intent |
| POST | `/bookings/:id/complete` | Teacher | Mark completed + release payout |
| POST | `/bookings/:id/cancel` | Parent/Teacher | Cancel booking (optional refund) |

Cancel body:

```json
{
  "reason": "Schedule conflict"
}
```

---

## Payments

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/payments` | Yes | Create payment |
| POST | `/payments/refund` | Yes | Refund a payment |
| POST | `/payments/webhooks/stripe` | Stripe signature | Stripe webhook handler |

---

## Reviews

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/reviews/teacher/:teacherId` | Optional | List reviews for a teacher |
| POST | `/reviews` | Yes | Create review |
| PATCH | `/reviews/:id` | Yes | Update review |

---

## Notifications

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/notifications` | Yes | List notifications |
| POST | `/notifications` | Yes | Create notification |
| PATCH | `/notifications/read-all` | Yes | Mark all as read |

---

## Admin

Requires `ADMIN` role.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/users` | List users |
| PATCH | `/admin/users` | Enable/disable or verify users |
| GET | `/admin/verifications` | Pending teacher verifications |
| GET | `/admin/disputes` | List disputes |
| PATCH | `/admin/disputes` | Resolve a dispute |

---

## Chat (WebSocket)

Namespace: `/chat`

Authenticate with:

```js
io(WS_URL + '/chat', { auth: { token: accessToken } })
```

| Event | Direction | Description |
|-------|-----------|-------------|
| `send-message` | Client → Server | Send message for a booking |
| `message-sent` | Server → Client | Sender confirmation |
| `new-message` | Server → Client | Receiver gets message |
| `mark-read` | Client → Server | Mark message read |
| `get-chat-history` | Client → Server | Paginated history |
| `chat-history` | Server → Client | History payload |
| `typing` | Client → Server | Typing indicator |
| `typing-status` | Server → Client | Typing status for peer |
| `user-online` / `user-offline` | Server → Client | Presence |
| `unread-count` | Server → Client | Unread messages on connect |

`send-message` payload:

```json
{
  "bookingId": "uuid",
  "receiverId": "uuid",
  "message": "Hello!",
  "attachment": "optional-url"
}
```

---

## Error format

Typical error response:

```json
{
  "statusCode": 400,
  "message": "Teacher is not available at this time",
  "timestamp": "2026-07-19T16:00:00.000Z"
}
```

Common status codes: `400` validation/business rule, `401` unauthorized, `404` not found, `500` server error.
