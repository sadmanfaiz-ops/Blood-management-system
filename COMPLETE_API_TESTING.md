# 📋 Complete API Testing Guide - Modules 1 & 2

## Overview

This guide covers testing all REST APIs for:
- **Module 1:** Profile Management
- **Module 2:** Blood Request & Donor Management

All APIs are fully functional and tested on your local system.

---

## 🚀 Quick Start - Test All APIs at Once

### Option 1: Automated Test Suite (Recommended)

Run all tests automatically:

```powershell
cd 'c:\Users\USER\Downloads\Blood-management-system'
node scripts/testAllAPIs.js
```

**Output:** Full test report with status for all endpoints

---

### Option 2: Web Test Panel

Visit: **http://127.0.0.1:3000/test.html**

Interactive testing with:
- ✅ Pre-filled sample data
- ✅ Tab-based organization
- ✅ Auto-token copying
- ✅ Live JSON responses
- ✅ Color-coded success/error messages

---

## 📚 API Reference

### Base URL
```
http://127.0.0.1:1320/api
```

---

## MODULE 1: PROFILE MANAGEMENT

### 1️⃣ Register User
**Endpoint:** `POST /auth/register`

**Description:** Create new user account (donor or recipient)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "bloodGroup": "O+",
  "phone": "9876543210",
  "location": "Dhaka",
  "isDonor": true,
  "isRecipient": false
}
```

**Success Response (201):**
```json
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "bloodGroup": "O+",
    "phone": "9876543210",
    "location": "Dhaka",
    "isDonor": true,
    "isRecipient": false
  }
}
```

**Error Cases:**
- `400` - Email already registered
- `400` - Missing required fields
- `400` - Invalid email format

**PowerShell Test:**
```powershell
$email = "user_$(Get-Random)@test.com"
$body = @{
    name="Test User"
    email=$email
    password="Test123456"
    bloodGroup="O+"
    phone="9876543210"
    location="Dhaka"
    isDonor=$true
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://127.0.0.1:1320/api/auth/register' `
  -Method POST -ContentType 'application/json' -Body $body

$response.Content | ConvertFrom-Json
```

---

### 2️⃣ Login User
**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and get JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "bloodGroup": "O+",
    "phone": "9876543210",
    "location": "Dhaka",
    "role": "donor",
    "isDonor": true,
    "isRecipient": false
  }
}
```

**Error Cases:**
- `401` - Invalid email or password
- `400` - Missing email or password

---

### 3️⃣ Get Current User Profile
**Endpoint:** `GET /auth/me`

**Description:** Retrieve current authenticated user's profile

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Success Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "bloodGroup": "O+",
  "phone": "9876543210",
  "location": "Dhaka",
  "role": "donor",
  "isDonor": true,
  "isRecipient": false,
  "status": "Active"
}
```

**Error Cases:**
- `401` - No token provided
- `401` - Invalid or expired token

**PowerShell Test:**
```powershell
$token = "eyJhbGciOiJIUzI1NiIs..."
$response = Invoke-WebRequest -Uri 'http://127.0.0.1:1320/api/auth/me' `
  -Headers @{ Authorization = "Bearer $token" }
$response.Content | ConvertFrom-Json
```

---

### 4️⃣ Update User Profile
**Endpoint:** `PUT /auth/me`

**Description:** Update user profile information

**Headers:**
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "9999999999",
  "location": "Chittagong",
  "bloodGroup": "A+"
}
```

**Success Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "9999999999",
    "location": "Chittagong",
    "bloodGroup": "A+"
  }
}
```

---

### 5️⃣ Change Password
**Endpoint:** `POST /auth/change-password`

**Description:** Change user password (requires current password)

**Headers:**
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "SecurePass123",
  "newPassword": "NewSecurePass456"
}
```

**Success Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

**Error Cases:**
- `401` - Invalid current password
- `400` - Current and new passwords are the same

---

### 6️⃣ Assign Admin Role (Admin Only)
**Endpoint:** `PATCH /auth/:id/role`

**Description:** Promote user to admin (admin only)

**Headers:**
```
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "role": "admin"
}
```

**Success Response (200):**
```json
{
  "message": "User role updated",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "role": "admin"
  }
}
```

---

## MODULE 2: BLOOD REQUEST & DONOR MANAGEMENT

### 1️⃣ Create Donor Profile
**Endpoint:** `POST /donors`

**Description:** Create a new donor profile

**Headers:**
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Donor",
  "bloodGroup": "O+",
  "location": "Dhaka",
  "phone": "9876543210"
}
```

**Success Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "name": "John Donor",
  "bloodGroup": "O+",
  "location": "Dhaka",
  "phone": "9876543210",
  "approvalStatus": "Pending",
  "availabilityStatus": "Available",
  "lastDonationDate": null
}
```

**PowerShell Test:**
```powershell
$token = "eyJhbGciOiJIUzI1NiIs..."
$body = @{
    name="John Donor"
    bloodGroup="O+"
    location="Dhaka"
    phone="9876543210"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://127.0.0.1:1320/api/donors' `
  -Method POST -Headers @{ Authorization = "Bearer $token" } `
  -ContentType 'application/json' -Body $body
$response.Content | ConvertFrom-Json
```

---

### 2️⃣ Search Donors (Public)
**Endpoint:** `GET /donors/search`

**Description:** Search for approved donors by blood group and location (public, no auth needed)

**Query Parameters:**
- `bloodGroup` (required): Blood group (e.g., "O+", "A-")
- `location` (required): Location name

**Example:**
```
GET /donors/search?bloodGroup=O%2B&location=Dhaka
```

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "John Donor",
    "bloodGroup": "O+",
    "location": "Dhaka",
    "phone": "9876543210",
    "approvalStatus": "Approved",
    "availabilityStatus": "Available"
  }
]
```

**PowerShell Test:**
```powershell
$response = Invoke-WebRequest -Uri 'http://127.0.0.1:1320/api/donors/search?bloodGroup=O%2B&location=Dhaka'
$response.Content | ConvertFrom-Json
```

---

### 3️⃣ Update Donor Availability
**Endpoint:** `PATCH /donors/:id/availability`

**Description:** Update donor's availability status and last donation date

**Headers:**
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "availabilityStatus": "Available",
  "lastDonationDate": "2025-12-11"
}
```

**Allowed Statuses:**
- `Available` - Can donate now
- `Unavailable` - Temporarily unavailable
- `Donated Recently` - Recently donated

**Success Response (200):**
```json
{
  "message": "Availability updated",
  "donor": {
    "availabilityStatus": "Available",
    "lastDonationDate": "2025-12-11"
  }
}
```

---

### 4️⃣ Create Blood Request
**Endpoint:** `POST /requests`

**Description:** Post a new blood request (recipients)

**Headers:**
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "bloodGroup": "O+",
  "quantityRequired": 2,
  "hospitalName": "City Hospital",
  "location": "Dhaka",
  "urgencyLevel": "High",
  "neededBefore": "2025-12-15"
}
```

**Success Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "recipientId": "507f1f77bcf86cd799439011",
  "bloodGroup": "O+",
  "quantityRequired": 2,
  "hospitalName": "City Hospital",
  "location": "Dhaka",
  "urgencyLevel": "High",
  "neededBefore": "2025-12-15",
  "status": "Pending",
  "createdAt": "2025-12-11T10:30:00Z"
}
```

**PowerShell Test:**
```powershell
$token = "eyJhbGciOiJIUzI1NiIs..."
$body = @{
    bloodGroup="O+"
    quantityRequired=2
    hospitalName="City Hospital"
    location="Dhaka"
    urgencyLevel="High"
    neededBefore="2025-12-15"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://127.0.0.1:1320/api/requests' `
  -Method POST -Headers @{ Authorization = "Bearer $token" } `
  -ContentType 'application/json' -Body $body
$response.Content | ConvertFrom-Json
```

---

### 5️⃣ View My Requests
**Endpoint:** `GET /requests/my`

**Description:** View all blood requests created by current user

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "bloodGroup": "O+",
    "quantityRequired": 2,
    "hospitalName": "City Hospital",
    "location": "Dhaka",
    "urgencyLevel": "High",
    "status": "Pending",
    "neededBefore": "2025-12-15",
    "createdAt": "2025-12-11T10:30:00Z"
  }
]
```

---

### 6️⃣ Update Request Status (User)
**Endpoint:** `PATCH /requests/:id`

**Description:** Update status of user's own blood request

**Headers:**
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "Fulfilled"
}
```

**Allowed Statuses:**
- `Pending` - Awaiting approval
- `Approved` - Approved by admin
- `Fulfilled` - Blood received
- `Cancelled` - Request cancelled

**Success Response (200):**
```json
{
  "message": "Request updated",
  "request": {
    "status": "Fulfilled"
  }
}
```

---

### 7️⃣ Get User Dashboard
**Endpoint:** `GET /dashboard/user`

**Description:** Get user-specific analytics and metrics

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Success Response (200):**
```json
{
  "user": {
    "name": "John Doe",
    "role": "donor"
  },
  "donations": 5,
  "requests": 2,
  "activeRequests": 1,
  "nearbyDonors": 12,
  "recentActivity": []
}
```

---

## ADMIN FUNCTIONS

### 1️⃣ List All Donors (Admin Only)
**Endpoint:** `GET /donors`

**Description:** View all donor profiles with status

**Headers:**
```
Authorization: Bearer <ADMIN_TOKEN>
```

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "John Donor",
    "bloodGroup": "O+",
    "location": "Dhaka",
    "phone": "9876543210",
    "approvalStatus": "Pending",
    "availabilityStatus": "Available",
    "createdAt": "2025-12-10T08:00:00Z"
  }
]
```

**Error Cases:**
- `403` - User is not admin

---

### 2️⃣ Approve/Reject Donor (Admin Only)
**Endpoint:** `PATCH /donors/:id/status`

**Description:** Approve or reject a donor registration

**Headers:**
```
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "Approved"
}
```

**Allowed Statuses:**
- `Approved` - Accept donor
- `Rejected` - Reject donor

**Success Response (200):**
```json
{
  "message": "Donor status updated",
  "donor": {
    "approvalStatus": "Approved"
  }
}
```

---

### 3️⃣ List All Blood Requests (Admin Only)
**Endpoint:** `GET /requests`

**Description:** View all blood requests in the system

**Headers:**
```
Authorization: Bearer <ADMIN_TOKEN>
```

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "recipientId": {
      "name": "Jane Recipient"
    },
    "bloodGroup": "O+",
    "quantityRequired": 2,
    "urgencyLevel": "High",
    "status": "Pending",
    "createdAt": "2025-12-11T10:30:00Z"
  }
]
```

---

### 4️⃣ Update Request Status (Admin Only)
**Endpoint:** `PATCH /requests/:id/status`

**Description:** Admin can approve or update request status

**Headers:**
```
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "Approved"
}
```

**Success Response (200):**
```json
{
  "message": "Request status updated",
  "request": {
    "status": "Approved"
  }
}
```

---

### 5️⃣ Get Admin Dashboard
**Endpoint:** `GET /dashboard/admin`

**Description:** View system-wide analytics and statistics

**Headers:**
```
Authorization: Bearer <ADMIN_TOKEN>
```

**Success Response (200):**
```json
{
  "totalDonors": 45,
  "approvedDonors": 38,
  "pendingDonors": 5,
  "totalRequests": 120,
  "fulfilledRequests": 95,
  "pendingRequests": 15,
  "monthlyTrends": {
    "requests": [10, 12, 15, 18, 20, 22],
    "fulfillments": [8, 10, 14, 16, 19, 21]
  }
}
```

---

## 🔐 Authentication

### Getting a Token

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <TOKEN>
```

**To get a token:**

1. **Register:** `POST /auth/register` → returns token
2. **Login:** `POST /auth/login` → returns token

### Token Format

Tokens are valid for **7 days** from issue date.

**Example Token Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTc2NTQ2NDk5MCwiZXhwIjoxNzY2MDY5Nzk5fQ.Xi7Nzc6pXs5PFdfTMn9dD17f5jNzWZoOhDxHonozYSQ
```

---

## 🛠️ HTTP Status Codes

| Code | Meaning | Common Cause |
|------|---------|--------------|
| 200 | Success | Request completed successfully |
| 201 | Created | New resource created successfully |
| 400 | Bad Request | Invalid data or missing fields |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions (not admin) |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

---

## 🐛 Troubleshooting

### "Invalid email or password" on Login
- ✅ Verify email exists in database
- ✅ Check password is correct (case-sensitive)
- ✅ Ensure you're using the exact email from registration

### "next is not a function" Error
- ✅ **FIXED** - Pre-save hook updated to modern async/await syntax

### "401 Unauthorized"
- ✅ Ensure token is included in Authorization header
- ✅ Check token has not expired (valid for 7 days)
- ✅ Verify header format: `Authorization: Bearer <TOKEN>`

### "403 Forbidden" on Admin Endpoints
- ✅ Admin endpoints require admin role
- ✅ Contact system admin to promote your user
- ✅ Or use admin credentials to test

### Backend Not Responding
- ✅ Verify Node server is running: `node server.js`
- ✅ Check port 1320 is not in use: `Get-NetTcpConnection -LocalPort 1320`
- ✅ Verify MongoDB connection: Check server logs

---

## 📝 Manual Testing Checklist

### Profile Management
- [ ] Register new user (donor)
- [ ] Register new user (recipient)
- [ ] Login with valid credentials
- [ ] Get current user profile
- [ ] Update profile information
- [ ] Change password
- [ ] Verify old password no longer works

### Donor Management
- [ ] Create donor profile (as registered donor)
- [ ] Search donors by blood group
- [ ] Search donors by location
- [ ] Update availability status
- [ ] Update last donation date

### Blood Requests
- [ ] Create blood request (as recipient)
- [ ] View my requests
- [ ] Update request status (user)
- [ ] View request details

### Admin Functions
- [ ] List all donors (should fail without admin role)
- [ ] Promote user to admin role
- [ ] List all donors (as admin)
- [ ] Approve donor registration
- [ ] Reject donor registration
- [ ] View all requests (as admin)
- [ ] Update request status (as admin)
- [ ] View admin dashboard

---

## 📊 Sample Test Data

### Donor Test User
```
Email: donor@test.com
Password: Test123456
Blood Group: O+
Location: Dhaka
Phone: 9876543210
```

### Recipient Test User
```
Email: recipient@test.com
Password: Test123456
Location: Dhaka
Phone: 9876543215
```

### Blood Request
```
Blood Group: O+
Quantity: 2 units
Hospital: City Hospital
Location: Dhaka
Urgency: High
Needed Before: 2025-12-15
```

---

## 🎯 Success Indicators

✅ **Module 1 Complete When:**
- All 6 auth endpoints return correct status codes
- Tokens are generated and work for authenticated endpoints
- Profile can be updated and changes are persisted
- Password change invalidates old password

✅ **Module 2 Complete When:**
- Donors can create and search profiles
- Recipients can create and manage requests
- Admin can approve/reject donors and requests
- Dashboard shows correct metrics

---

## 📞 Need Help?

1. Check the test panel: **http://127.0.0.1:3000/test.html**
2. Run automated tests: `node scripts/testAllAPIs.js`
3. Check server logs for error details
4. Verify MongoDB is connected
5. Review this guide for API requirements

