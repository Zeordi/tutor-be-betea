# Tutor Be Betea API Documentation

## Base URL

```
http://localhost:4000/api
```

Interactive Swagger (planned): `http://localhost:4000/api/docs`

Authenticated routes expect:

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

Response:

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "userType": "PARENT",
    "isVerified": true
  },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "expiresIn": 900
}
```

### Refresh / verify / logout

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/refresh` | Exchange refresh token |
| POST | `/auth/verify-email` | Verify email with token |
| POST | `/auth/logout` | Invalidate session |

---

## Teachers

### Search Teachers

```http
GET /teachers/search?subject=math&minPrice=20&maxPrice=60&rating=4&radius=10&page=1&limit=20
```

Public endpoint (no auth required).

Response:

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Sarah Johnson",
      "subject": "Mathematics",
      "rating": 4.9,
      "reviews": 45,
      "price": 45,
      "distance": "2.3 km",
      "image": "url",
      "verified": true,
      "experience": 6,
      "availability": ["Mon", "Wed", "Fri"]
    }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 3
}
```

### Get Teacher Profile

```http
GET /teachers/{id}
Authorization: Bearer {accessToken}
```

Response:

```json
{
  "id": "uuid",
  "user": {
    "fullName": "Sarah Johnson",
    "profileImage": "url",
    "phone": "+251912345678"
  },
  "bio": "Experienced math teacher with 6 years...",
  "hourlyRate": 45,
  "avgRating": 4.9,
  "totalReviews": 45,
  "subjects": ["Algebra", "Geometry", "Calculus"],
  "availability": [
    {
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "17:00"
    }
  ],
  "experienceYears": 6,
  "education": [
    {
      "degree": "BSc Mathematics",
      "institution": "Addis Ababa University",
      "year": "2018"
    }
  ]
}
```

Also available:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/teachers` | Simple list/search (`?q=`) |
| POST | `/teachers/profile` | Create teacher profile |
| PATCH | `/teachers/profile` | Update teacher profile |
| GET/POST | `/teachers/verification` | Verification status / submit |
| GET/PUT | `/teachers/availability` | Weekly availability |

---

## Bookings

### List bookings

```http
GET /bookings?status=PENDING&page=1&limit=20
Authorization: Bearer {accessToken}
```

Role-aware: parents see their requests, teachers see theirs, admins see all.

### Get booking

```http
GET /bookings/{id}
Authorization: Bearer {accessToken}
```

### Create Booking

```http
POST /bookings
Authorization: Bearer {accessToken}
```

Request body:

```json
{
  "teacherId": "uuid",
  "bookingDate": "2026-07-15",
  "startTime": "09:00",
  "endTime": "10:00",
  "studentName": "Alex Johnson",
  "studentAge": 12,
  "learningGoals": "Improve algebra skills",
  "isTrialLesson": false
}
```

Response:

```json
{
  "id": "uuid",
  "status": "PENDING",
  "totalAmount": 45.00,
  "platformFee": 6.75,
  "teacherPayout": 38.25,
  "bookingDate": "2026-07-15",
  "startTime": "09:00",
  "endTime": "10:00"
}
```

### Confirm Booking (Teacher accept)

```http
PUT /bookings/{id}/confirm
Authorization: Bearer {accessToken}
```

(`POST /bookings/{id}/confirm` is also accepted.)

Teacher accept does **not** set `CONFIRMED`. Booking stays `PENDING` until Stripe webhook confirms payment. See `docs/PAYMENTS.md`.

Response:

```json
{
  "booking": {
    "id": "uuid",
    "status": "PENDING"
  },
  "clientSecret": "pi_xxx_secret_xxx",
  "stripePaymentIntent": "pi_xxx",
  "message": "Teacher accepted. Parent must complete payment to confirm the booking."
}
```

### Complete / cancel

| Method | Path | Description |
|--------|------|-------------|
| POST | `/bookings/{id}/complete` | Mark lesson completed + release payout (requires SUCCEEDED payment) |
| POST | `/bookings/{id}/cancel` | Cancel booking (`{ "reason": "..." }`) |

---

## Favorites

Parent-only. Schema already had `Favorite`; these routes expose it.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/favorites` | List saved teachers |
| GET | `/favorites/ids` | Teacher id list for heart toggles |
| POST | `/favorites` | Body `{ "teacherId": "uuid" }` |
| DELETE | `/favorites/{teacherId}` | Remove favorite |

---

## Payments

### Pay / retry (after teacher accept)

```http
POST /payments
Authorization: Bearer {accessToken}
```

Request body:

```json
{
  "bookingId": "uuid"
}
```

Only the booking parent (or admin) may call this. Amount is taken from the booking. Requires a payment row created by teacher accept.

Response:

```json
{
  "id": "uuid",
  "bookingId": "uuid",
  "amount": 45.0,
  "currency": "usd",
  "status": "PENDING",
  "clientSecret": "pi_xxx_secret_xxx",
  "stripePaymentIntent": "pi_xxx"
}
```

Parent confirms the PaymentIntent client-side (Stripe.js). Booking becomes `CONFIRMED` only when Stripe calls the webhook.

### Deprecated: process

```http
POST /payments/process
```

Returns **410 Gone**. Do not mark payments succeeded from the API.

Also available:

| Method | Path | Description |
|--------|------|-------------|
| POST | `/payments/refund` | Refund a payment (admin) |
| POST | `/payments/webhooks/stripe` | Stripe webhook (raw body + signature) |

---

## Chat

### Get Chat History

```http
GET /chat/history?bookingId=uuid&page=1&limit=50
Authorization: Bearer {accessToken}
```

Response:

```json
{
  "messages": [
    {
      "id": "uuid",
      "senderId": "uuid",
      "message": "Hello! I'm available for the lesson.",
      "createdAt": "2026-07-14T09:00:00Z",
      "isRead": true
    }
  ],
  "total": 25,
  "page": 1,
  "totalPages": 1
}
```

---

## Reviews

### Submit Review

```http
POST /reviews
Authorization: Bearer {accessToken}
```

Request body:

```json
{
  "bookingId": "uuid",
  "rating": 5,
  "reviewText": "Excellent teacher! My daughter improved significantly.",
  "isPublic": true
}
```

Response:

```json
{
  "id": "uuid",
  "rating": 5,
  "reviewText": "Excellent teacher! My daughter improved significantly.",
  "isPublic": true,
  "createdAt": "2026-07-14T10:00:00Z"
}
```

Also: `GET /reviews/teacher/:teacherId`, `PATCH /reviews/:id`

---

## Notifications & Admin

| Method | Path | Description |
|--------|------|-------------|
| GET | `/notifications` | List notifications |
| POST | `/notifications` | Create notification |
| PATCH | `/notifications/read-all` | Mark all read |
| GET | `/admin/users` | List users (ADMIN) |
| PATCH | `/admin/users` | Manage users (ADMIN) |
| GET | `/admin/verifications` | Teacher verifications (ADMIN) |
| GET | `/admin/disputes` | List disputes (ADMIN) |
| PATCH | `/admin/disputes` | Resolve dispute (ADMIN) |

---

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": ["Field is required"]
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## Rate Limits

- 100 requests per minute per IP
- 1000 requests per hour per user

---

## WebSocket Events

Namespace: `/chat`

### Connect

```js
const socket = io('http://localhost:4000/chat', {
  auth: { token: 'your_jwt_token' }
});
```

### Send Message

```js
socket.emit('send-message', {
  bookingId: 'uuid',
  message: 'Hello!'
});
```

Receiver is derived server-side from the booking participants (parent ↔ teacher user). Clients should not send `conversationId` or `body`.

### Listen for New Messages

```js
socket.on('new-message', (message) => {
  console.log('New message:', message);
});

socket.on('message-sent', (message) => {
  console.log('Own message confirmed:', message);
});
```

### Typing Indicator

```js
socket.emit('typing', {
  bookingId: 'uuid',
  isTyping: true
});
```

Other events: `mark-read`, `message-read`, `get-chat-history`, `chat-history`, `user-online`, `user-offline`, `unread-count`.
