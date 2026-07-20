# Chat contract (booking-threaded)

## Canonical client ↔ server

| Concern | Contract |
|---------|----------|
| Namespace | `/chat` |
| Auth | `io(url, { auth: { token: accessToken } })` — not query |
| Thread key | `bookingId` |
| Send | emit `send-message` `{ bookingId, message }` |
| Confirm | listen `message-sent` |
| Receive | listen `new-message` |
| History REST | `GET /api/chat/history?bookingId=` |
| History WS | emit `get-chat-history` → `chat-history` |
| Typing | emit `typing` `{ bookingId, isTyping }` → `typing-status` |

Receiver is resolved on the server from booking parent + teacher user. Do not use `conversationId` / `body` / emit `message`.

## UI

- Parent: `/parent/messages?bookingId=`
- Teacher: `/teacher/messages?bookingId=`
- Thread list comes from `/api/bookings`
