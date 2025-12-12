# Blood Donation System - Testing Guide

## Prerequisites
- Node.js installed
- MongoDB running on `mongodb://127.0.0.1:27017`
- Backend server running on `http://127.0.0.1:1320`
- Frontend on `http://127.0.0.1:3000`

---

## MODULE 1: PROFILE MANAGEMENT ✓

### Features Implemented
1. **User Registration** - Create account with name, email, password, blood group, phone, location
2. **User Login** - Secure login with JWT token (7-day expiry)
3. **Profile Viewing** - Get current user profile via `/api/auth/me`
4. **Profile Update** - Update name, email, phone, location, blood group
5. **Change Password** - Securely change login password
6. **Admin Role Management** - Admins can update user roles and status

### How to Test Module 1

#### Option A: Browser UI
1. **Signup:** Go to `http://127.0.0.1:3000/signup.html`
   - Fill form: name, email, password (min 6 chars), phone, blood group, location, account type
   - Submit → Should redirect to home page with success message

2. **Login:** Go to `http://127.0.0.1:3000/login.html`
   - Enter email and password from signup
   - Submit → Should redirect to home page

3. **Profile:** From logged-in home page:
   - Open browser DevTools (F12)
   - Check `localStorage.getItem('token')` to confirm token saved
   - Token will be sent with future requests as `Authorization: Bearer <token>`

#### Option B: API Testing (Postman/Insomnia)

**Register:**
```
POST http://127.0.0.1:1320/api/auth/register
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "TestPass123",
  "bloodGroup": "O+",
  "phone": "9876543210",
  "location": "Dhaka",
  "isDonor": true,
  "isRecipient": false
}
```
Response: Returns `token` and `user` object.

**Login:**
```
POST http://127.0.0.1:1320/api/auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "TestPass123"
}
```
Response: Returns `token` and `user` object. Save token for next requests.

**Get Profile:**
```
GET http://127.0.0.1:1320/api/auth/me
Authorization: Bearer <token>
```

**Update Profile:**
```
PUT http://127.0.0.1:1320/api/auth/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Alice Updated",
  "phone": "9876543211",
  "location": "Chittagong"
}
```

**Change Password:**
```
POST http://127.0.0.1:1320/api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "TestPass123",
  "newPassword": "NewPass456"
}
```

---

## MODULE 2: BLOOD REQUEST & DONOR MANAGEMENT ✓

### Features Implemented
1. **Donor Profile Creation** - Users can register as donors with blood group, location, phone
2. **Donor Search** - Search available donors by blood group and location (public endpoint)
3. **Update Donor Availability** - Donors can set status (Available/Unavailable/Donated Recently)
4. **Blood Request Creation** - Recipients can post requests (blood group, quantity, hospital, urgency)
5. **Request Management** - View/update own requests (Pending→Fulfilled→Cancelled)
6. **Admin Donor Approval** - Admins can approve/reject donor registrations
7. **Admin Request Management** - Admins can view, approve, or reject requests
8. **Nearby Donors** - Find compatible donors near recipient location (stubbed)
9. **Notifications** - SMS/Email stubs for notifying nearby donors (logged to console)

### How to Test Module 2

#### Step 1: Create Donor Profile
```
POST http://127.0.0.1:1320/api/donors
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Donor",
  "bloodGroup": "O+",
  "location": "Dhaka",
  "phone": "9876543210"
}
```
Response: Donor object with `status: 'Pending'` (requires admin approval to appear in search).

#### Step 2: Approve Donor (Admin Only)
First, register an admin user:
```
POST http://127.0.0.1:1320/api/auth/register
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "AdminPass123",
  "bloodGroup": "O+",
  "phone": "1234567890",
  "location": "Dhaka",
  "isDonor": false,
  "isRecipient": false
}
```
Then manually update user role in MongoDB or ask another admin to:
```
PATCH http://127.0.0.1:1320/api/auth/:userId/role
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role": "admin"
}
```

Once approved, donor appears in search with `status: 'Approved'`.

#### Step 3: Search Donors
```
GET http://127.0.0.1:1320/api/donors/search?bloodGroup=O%2B&location=Dhaka
```
Response: Array of approved donors in that location.

#### Step 4: Create Blood Request
```
POST http://127.0.0.1:1320/api/requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "bloodGroup": "O+",
  "quantityRequired": 2,
  "hospitalName": "City Hospital",
  "location": "Dhaka",
  "urgencyLevel": "High",
  "neededBefore": "2025-12-31"
}
```
Response: Request object with `status: 'Pending'`. Server logs SMS/Email notifications to nearby donors.

#### Step 5: View My Requests
```
GET http://127.0.0.1:1320/api/requests/my
Authorization: Bearer <token>
```

#### Step 6: Update Request Status
```
PATCH http://127.0.0.1:1320/api/requests/:requestId
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Fulfilled"
}
```

#### Step 7: Update Donor Availability
```
PATCH http://127.0.0.1:1320/api/donors/:donorId/availability
Authorization: Bearer <token>
Content-Type: application/json

{
  "availability": true,
  "availabilityStatus": "Available",
  "lastDonationDate": "2025-12-01"
}
```

---

## Browser UI Tests

### Home Page
- Go to `http://127.0.0.1:3000`
- Verify navbar, hero slider, sections load
- Test donor search form (blood group + zone)

### Dashboard
- Go to `http://127.0.0.1:3000/dashboard.html` (requires login)
- Should show user metrics: total donations, active requests, nearby donors
- Admin users also see: registered donors, fulfilled requests, monthly trends

### Admin Panel
- Go to `http://127.0.0.1:3000/admin.html` (requires admin login)
- Manage Donors: list, approve/reject, view availability
- Manage Requests: list, approve/reject, update status

### Requests Page
- Go to `http://127.0.0.1:3000/requests.html` (requires login)
- Create new request
- View and manage your requests (cancel, mark fulfilled)

---

## Running Automated Test Suite

```bash
cd C:\Users\USER\Downloads\Blood-management-system
node scripts/testAPI.js
```

This runs all Module 1 & 2 tests and logs results:
- ✅ Passed tests
- ❌ Failed tests with error details

---

## Known Issues & Solutions

| Issue | Solution |
|-------|----------|
| "next is not a function" error | Fixed in User.js pre-save hook |
| Registration fails with validation error | Ensure phone is numeric (10+ digits) |
| Donor not appearing in search | Admin must approve donor first (`status: 'Approved'`) |
| "Unauthorized" on API calls | Include `Authorization: Bearer <token>` header |
| MongoDB connection error | Ensure MongoDB is running: `mongod` |

---

## Next Steps: Module 3 & 4

Once Module 1 & 2 are verified working:
- **Module 3:** Enhanced dashboards, notification history, analytics views
- **Module 4:** Advanced analytics (request trends, donor demographics, system performance)

