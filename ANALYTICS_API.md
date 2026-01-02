# Analytics API Documentation

## Overview
The Analytics API tracks all activities in the blood donation system including:
- Request creation
- Donor approvals/rejections
- Notification deliveries
- User signups and logins

## API Endpoints (Admin Only)

All endpoints require authentication with `Authorization: Bearer <token>` header and admin role.

### 1. Get Analytics Dashboard
```
GET /api/analytics/dashboard
```
Returns complete dashboard data including summary, recent events, and notification stats.

**Response Example:**
```json
{
  "summary": {
    "totalEvents": 45,
    "eventCounts": [
      { "_id": "REQUEST_CREATED", "count": 12 },
      { "_id": "DONOR_APPROVED", "count": 8 },
      { "_id": "NOTIFICATION_SENT", "count": 25 }
    ],
    "bloodGroupStats": [
      { "_id": "O+", "count": 15 },
      { "_id": "A+", "count": 10 }
    ],
    "locationStats": [
      { "_id": "Dhaka", "count": 28 },
      { "_id": "Chittagong", "count": 17 }
    ]
  },
  "recentEvents": [
    {
      "_id": "...",
      "eventType": "REQUEST_CREATED",
      "userId": { "name": "John Doe", "email": "john@test.com" },
      "timestamp": "2025-12-26T10:30:00Z",
      "metadata": { "bloodGroup": "O+", "location": "Dhaka" }
    }
  ],
  "notificationStats": {
    "totalNotifications": 25,
    "byType": [
      { "_id": "EMAIL", "count": 25 }
    ]
  }
}
```

---

### 2. Get Analytics Summary
```
GET /api/analytics/summary?startDate=2025-12-01&endDate=2025-12-31
```
Get event counts, blood group stats, and location statistics.

**Query Parameters:**
- `startDate` (optional): Start date (ISO format)
- `endDate` (optional): End date (ISO format)

**Response:**
```json
{
  "totalEvents": 45,
  "eventCounts": [...],
  "bloodGroupStats": [...],
  "locationStats": [...]
}
```

---

### 3. Get Recent Events
```
GET /api/analytics/recent?limit=20
```
Get the most recent system events with user and donor details.

**Query Parameters:**
- `limit` (optional, default: 20): Number of events to return

**Response:**
```json
[
  {
    "_id": "...",
    "eventType": "REQUEST_CREATED",
    "userId": { "name": "John", "email": "john@test.com" },
    "donorId": null,
    "requestId": { "bloodGroup": "O+", "location": "Dhaka" },
    "timestamp": "2025-12-26T10:30:00Z",
    "metadata": {
      "bloodGroup": "O+",
      "location": "Dhaka",
      "urgencyLevel": "High"
    }
  }
]
```

---

### 4. Get Notification Delivery Stats
```
GET /api/analytics/notifications?startDate=2025-12-01&endDate=2025-12-31
```
Get notification delivery statistics.

**Query Parameters:**
- `startDate` (optional): Start date (ISO format)
- `endDate` (optional): End date (ISO format)

**Response:**
```json
{
  "totalNotifications": 25,
  "byType": [
    { "_id": "EMAIL", "count": 25 }
  ]
}
```

---

## Event Types

| Event Type | Triggered When | Metadata |
|---|---|---|
| `REQUEST_CREATED` | Recipient posts new blood request | bloodGroup, location, urgencyLevel |
| `DONOR_APPROVED` | Admin approves donor profile | status, bloodGroup, location |
| `DONOR_REJECTED` | Admin rejects donor profile | status, bloodGroup, location |
| `NOTIFICATION_SENT` | Email/SMS sent to user | notificationType, recipientEmail, subject |
| `REQUEST_FULFILLED` | Request marked as fulfilled | (planned) |
| `USER_SIGNUP` | New user registers | (planned) |
| `USER_LOGIN` | User logs in | (planned) |

---

## Example Usage

### Test with cURL
```bash
# Get dashboard (requires bearer token)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://127.0.0.1:1320/api/analytics/dashboard

# Get recent events
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://127.0.0.1:1320/api/analytics/recent?limit=10"

# Get summary with date range
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://127.0.0.1:1320/api/analytics/summary?startDate=2025-12-01&endDate=2025-12-31"
```

### Test with PowerShell
```powershell
$headers = @{'Authorization' = 'Bearer YOUR_JWT_TOKEN'}

# Get dashboard
$response = Invoke-WebRequest -Uri "http://127.0.0.1:1320/api/analytics/dashboard" -Headers $headers
$response.Content | ConvertFrom-Json

# Get recent events
$response = Invoke-WebRequest -Uri "http://127.0.0.1:1320/api/analytics/recent?limit=10" -Headers $headers
$response.Content | ConvertFrom-Json | Format-Table
```

---

## Data Stored

Each analytics event records:
- **Event Type**: Category of activity
- **User ID**: Who triggered it
- **Donor ID**: Related donor (if applicable)
- **Request ID**: Related request (if applicable)
- **Metadata**: Event-specific details
- **Timestamp**: When it occurred
- **IP Address**: Source IP (optional)

---

## Database Schema

```javascript
{
  eventType: String,           // One of the event types above
  userId: ObjectId,            // User who triggered event
  donorId: ObjectId,           // Related donor
  requestId: ObjectId,         // Related request
  metadata: {                  // Event-specific data
    bloodGroup: String,
    location: String,
    urgencyLevel: String,
    notificationType: String,
    recipientEmail: String,
    status: String
  },
  timestamp: Date,             // Created at
  ipAddress: String            // Source IP
}
```

---

## Best Practices

1. **Authorization**: Always verify user is admin before accessing analytics
2. **Date Filtering**: Use date ranges for large datasets
3. **Pagination**: Use `limit` parameter to avoid loading too many events
4. **Monitoring**: Set up alerts for anomalies (e.g., sudden drop in approvals)

