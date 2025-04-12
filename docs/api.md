# API Documentation

This document provides detailed information about the Hatchling API endpoints.

## Authentication

All API requests (except for webhooks and login) require authentication using a JWT token.

**Headers:**
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### `POST /api/auth/login`

Generate and send a magic link for authentication.

**Request:**
```json
{
  "phone_number": "+15551234567"
}
```

**Response:**
```json
{
  "message": "Magic link sent successfully",
  "expires_in": 600
}
```

#### `GET /api/auth/verify`

Verify a magic link token.

**Query Parameters:**
- `token`: The magic link token

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "user_id": "user123",
    "name": "Jane Smith",
    "phone_number": "+15551234567"
  },
  "is_new_user": false
}
```

#### `POST /api/auth/create-account`

Create a new user account.

**Request:**
```json
{
  "name": "Jane Smith",
  "phone_number": "+15551234567",
  "default_privacy": "private",
  "nudge_opt_in": true,
  "nudge_frequency": "occasionally"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "user_id": "user123",
    "name": "Jane Smith",
    "phone_number": "+15551234567"
  }
}
```

### Entries

#### `POST /api/entry`

Create a new memory entry.

**Request:**
```json
{
  "content": "First steps today!",
  "media_url": "https://example.com/photo.jpg",
  "transcription": "She took her first steps today and was so excited!",
  "tags": ["Milestone", "First Steps"],
  "date_of_memory": "2025-04-12T15:30:00Z",
  "privacy": "private",
  "source_type": "app"
}
```

**Response:**
```json
{
  "message": "Entry created successfully",
  "entry_id": "entry123",
  "tags": ["Milestone", "First Steps"]
}
```

#### `GET /api/entries`

Retrieve entries for a user.

**Query Parameters:**
- `journal_id` (optional): Filter by journal ID
- `tag` (optional): Filter by tag
- `start_date` (optional): Filter by start date
- `end_date` (optional): Filter by end date
- `limit` (optional): Number of entries to return (default: 20)
- `offset` (optional): Offset for pagination (default: 0)

**Response:**
```json
{
  "entries": [
    {
      "entry_id": "entry123",
      "content": "First steps today!",
      "media_url": "https://example.com/photo.jpg",
      "transcription": "She took her first steps today and was so excited!",
      "tags": ["Milestone", "First Steps"],
      "date_of_memory": "2025-04-12T15:30:00Z",
      "timestamp_created": "2025-04-12T15:35:00Z",
      "author_id": "user123",
      "privacy": "private",
      "source_type": "app"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

#### `GET /api/entry/{entry_id}`

Retrieve a specific entry.

**Response:**
```json
{
  "entry_id": "entry123",
  "content": "First steps today!",
  "media_url": "https://example.com/photo.jpg",
  "transcription": "She took her first steps today and was so excited!",
  "tags": ["Milestone", "First Steps"],
  "date_of_memory": "2025-04-12T15:30:00Z",
  "timestamp_created": "2025-04-12T15:35:00Z",
  "author_id": "user123",
  "privacy": "private",
  "source_type": "app"
}
```

#### `PATCH /api/entry/{entry_id}`

Update an existing entry.

**Request:**
```json
{
  "content": "Updated content",
  "tags": ["Milestone", "First Steps", "Updated"]
}
```

**Response:**
```json
{
  "message": "Entry updated successfully",
  "entry_id": "entry123"
}
```

#### `DELETE /api/entry/{entry_id}`

Soft delete an entry.

**Response:**
```json
{
  "message": "Entry deleted successfully",
  "entry_id": "entry123"
}
```

### SMS Webhook

#### `POST /api/sms/webhook`

Handle incoming SMS messages from Twilio.

**Request:**
Form data from Twilio webhook:
- `From`: Phone number
- `Body`: Message content
- `NumMedia`: Number of media attachments
- `MediaUrl0`, `MediaUrl1`, etc.: URLs of media attachments

**Response:**
Empty 200 OK response (Twilio requires this)

### Stripe Webhook

#### `POST /api/stripe/webhook`

Handle Stripe webhook events.

**Request:**
Stripe webhook event data

**Response:**
```json
{
  "received": true
}
```

## Error Responses

All API endpoints return appropriate HTTP status codes and error messages:

**400 Bad Request:**
```json
{
  "error": "Invalid request parameters"
}
```

**401 Unauthorized:**
```json
{
  "error": "Authentication required"
}
```

**403 Forbidden:**
```json
{
  "error": "Access denied"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**429 Too Many Requests:**
```json
{
  "error": "Rate limit exceeded",
  "retry_after": 3600
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

The API implements rate limiting with the following constraints:
- SMS entries: 20 per hour per user
- Media uploads: 15MB maximum size per file
