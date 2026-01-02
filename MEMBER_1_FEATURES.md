# Member-1: Features and Implementation Overview

## Project: Blood Management System
**Your Role:** Member-1 - Primary Developer for Profile Management and Blood Request/Notification System

---

## Module 1: Profile Management

### Feature 1.1: User Account Creation & Authentication ✅
**Requirement:**
- Users can create an account with name, email, password, and blood group
- Users can securely log in, log out, and access personalized features based on role
- Support for multiple roles: donor, recipient, admin

**Implementation Files:**

#### Backend:
- **[routes/authRoutes.js](routes/authRoutes.js)** - Core authentication endpoints
  - `POST /api/auth/register` - User registration with validation
  - `POST /api/auth/login` - Secure login with JWT token
  - Password hashing using bcryptjs (10 salt rounds)
  - Role-based access control (donor, recipient, admin)

- **[models/User.js](models/User.js)** - User data model
  - Fields: name, email, password, bloodGroup, phone, location, role, isDonor, isRecipient
  - Password hashing pre-hook before saving
  - Password comparison method for authentication
  - Email validation with regex pattern
  - Blood group enum: O+, O-, A+, A-, B+, B-, AB+, AB-
  - Status tracking: Active/Inactive

- **[middleware/auth.js](middleware/auth.js)** - Authentication middleware
  - JWT token verification
  - Role-based authorization (requireRole function)
  - User context extraction from token

#### Frontend:
- **[frontend/login.html](frontend/login.html)** - Login interface
  - Email and password input fields
  - Form validation
  - JWT token storage in localStorage
  - Redirect after successful login

- **[frontend/signup.html](frontend/signup.html)** - Registration interface
  - Name, email, password, blood group, phone, location inputs
  - Role selection (Donor/Recipient)
  - Form validation
  - Error handling

#### Key Features:
- ✅ Password hashing with bcryptjs (10 rounds salt)
- ✅ Unique email validation
- ✅ JWT token-based authentication (7-day expiry)
- ✅ Role-based user types
- ✅ Secure password comparison
- ✅ Account creation with blood group

---

### Feature 1.2: User Profile Management & Updates ✅
**Requirement:**
- Users can view and update personal information (name, email, phone, location)
- Change-password feature for secure credential updates

**Implementation Files:**

#### Backend:
- **[routes/authRoutes.js](routes/authRoutes.js#L120)** - Profile endpoints
  - `GET /api/auth/me` - Get current user profile (requires auth)
  - `PUT /api/auth/me` - Update profile (name, email, phone, location, bloodGroup)

- **[models/User.js](models/User.js)** - User schema with updatable fields

#### Frontend:
- **[frontend/profile.html](frontend/profile.html)** - User profile page (674 lines)
  - View current profile information
  - Edit form with pre-filled values
  - Update name, email, phone, location, blood group
  - Change password form
  - Donor blood donation registration form
  - Profile picture/avatar section
  - Responsive design with tabbed interface

#### Key Features:
- ✅ View current profile data
- ✅ Update all personal information
- ✅ Change password securely
- ✅ Blood group modification
- ✅ Location update
- ✅ Real-time form validation
- ✅ Error handling and success messages

---

## Module 2: Blood Request and Donor Management

### Feature 2.1: Blood Request Management ✅
**Requirement:**
- Recipients can post new blood requests (blood group, quantity, hospital, urgency)
- Recipients can view and manage status (Pending, Approved, Fulfilled, Cancelled)

**Implementation Files:**

#### Backend:
- **[models/BloodRequest.js](models/BloodRequest.js)** - Blood request schema
  - Fields: recipientId, bloodGroup, quantityRequired, hospitalName, location, urgencyLevel, status, neededBefore
  - Status enum: Pending, Approved, Fulfilled, Cancelled
  - Urgency levels: Low, Medium, High
  - Timestamps for tracking creation/updates

- **[routes/requestRoutes.js](routes/requestRoutes.js)** - Blood request endpoints
  - `POST /api/requests` - Create new blood request (auth required, recipient only)
  - `GET /api/requests/my` - View own requests
  - `PATCH /api/requests/:id` - Update request status (e.g., cancel, mark fulfilled)
  - `GET /api/requests` - Admin view all requests (admin only)
  - Automatic nearby donor notification on request creation

#### Frontend:
- **[frontend/requests.html](frontend/requests.html)** - Blood request interface
  - Form to post new blood request
  - Blood group selection
  - Quantity input
  - Hospital name input
  - Location selection
  - Urgency level dropdown
  - Needed before date picker
  - View submitted requests
  - Request status display (Pending, Approved, etc.)
  - Cancel request functionality

#### Key Features:
- ✅ Create blood requests with all required fields
- ✅ Request status tracking (4 states)
- ✅ View personal requests history
- ✅ Update request status
- ✅ Date-based request tracking
- ✅ Urgency level classification
- ✅ Timestamp tracking (createdAt, updatedAt)
- ✅ Recipient-only access control

---

### Feature 2.2: Map Integration & Nearby Donor Discovery ✅
**Requirement:**
- System integrates Map API to display nearest available donors
- Based on recipient location with geospatial queries

**Implementation Files:**

#### Backend:
- **[utils/mapService.js](utils/mapService.js)** - Geospatial query service
  - `findNearbyDonors(bloodGroup, location, radius)` function
  - MongoDB $geoNear aggregation pipeline
  - Converts location names to coordinates
  - Calculates distance in kilometers
  - Returns sorted list by proximity
  - Filters by blood group and availability status

- **[models/Donor.js](models/Donor.js)** - Donor schema with geospatial indexing
  - GeoJSON coordinates format (longitude, latitude)
  - 2dsphere index for geospatial queries
  - Blood group, availability status, last donation date
  - Donor contact information

#### Frontend:
- **[frontend/map.html](frontend/map.html)** (1139 lines) - Interactive map interface
  - Leaflet.js integration with OpenStreetMap tiles
  - User location marker (blue dashed circle - lat: 23.77341, lng: 90.42523)
  - Donor markers color-coded by blood group:
    - Red: O+ / O-
    - Blue: A+ / A-
    - Green: B+ / B-
    - Yellow: AB+ / AB-
  - Region dropdown with 19+ cities
  - Coordinate input fields
  - Search by region or coordinates
  - Display list of nearby donors with distance
  - Marker tooltips with donor information
  - Automatic marker clustering
  - Zoom and pan controls

- **[utils/regionCoordinates.js](utils/regionCoordinates.js)** - Region mapping
  - 19+ Bangladeshi regions with GPS coordinates
  - Includes: Dhaka, Gulshan, Mirpur, Badda, Dhanmondi, Chattogram, Sylhet, etc.
  - Merul Badda (BRAC University): 23.8068, 90.4203

#### Key Features:
- ✅ Geospatial donor search within radius
- ✅ Blood group filtering
- ✅ Distance calculation in km
- ✅ Interactive map display
- ✅ Location-based region selection
- ✅ Donor marker color-coding
- ✅ User location tracking (23.77341, 90.42523)
- ✅ Manual GPS coordinates input
- ✅ Region-to-coordinates auto-conversion
- ✅ Responsive map layout
- ✅ Marker clustering for density management

---

### Feature 2.3: Automatic Notification System ✅
**Requirement:**
- System automatically sends notifications for important updates
- Donor approval, request acceptance, donation confirmations
- SMS/Email API integration

**Implementation Files:**

#### Backend:
- **[utils/notifications.js](utils/notifications.js)** - Notification service
  - `sendEmailNotification(email, subject, body)` - Nodemailer/SMTP
  - `sendSmsNotification(phone, message)` - Twilio SMS
  - `sendNotificationsNearby(donors, request)` - Broadcast to nearby donors
  - SMTP configuration support (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
  - Twilio configuration (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM)
  - Fallback logging for development environment
  - Email templates with request details
  - SMS message formatting

- **[routes/requestRoutes.js#L50-80](routes/requestRoutes.js)** - Notification integration
  - Auto-notify nearby donors on new request creation
  - Email notification on request status updates
  - Recipient email notifications on approval/cancellation

#### Frontend:
- **[frontend/dashboard.html](frontend/dashboard.html)** - Notification display
  - Shows notification history
  - Notification status (read/unread)
  - Notification timestamp
  - Notification type badges

#### Environment Variables Required (.env):
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=no-reply@yourdomain.com
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_FROM=+1234567890
```

#### Key Features:
- ✅ Email notifications via SMTP/Nodemailer
- ✅ SMS notifications via Twilio
- ✅ Broadcast to nearby donors
- ✅ Request status update notifications
- ✅ Automatic trigger on request creation
- ✅ Error handling with logging
- ✅ Development fallback (console logging)
- ✅ Analytics event logging integration
- ✅ Configurable email subjects and templates

---

## Technology Stack

### Backend:
- **Node.js/Express** - Server framework
- **MongoDB/Mongoose** - Database with geospatial indexing
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Twilio** - SMS service
- **CORS** - Cross-origin resource sharing

### Frontend:
- **HTML5** - Structure
- **CSS3** - Styling (responsive design)
- **Vanilla JavaScript** - Functionality
- **Leaflet.js** - Interactive maps
- **OpenStreetMap** - Map tiles

### Dependencies (package.json):
```json
{
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.0",
  "mongoose": "^9.0.0",
  "nodemailer": "^7.0.12",
  "twilio": "^5.11.1"
}
```

---

## API Endpoints Summary

### Authentication Endpoints:
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create account | ✗ |
| POST | `/api/auth/login` | Login & get token | ✗ |
| GET | `/api/auth/me` | Get profile | ✓ |
| PUT | `/api/auth/me` | Update profile | ✓ |

### Blood Request Endpoints:
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/api/requests` | Create request | ✓ | Recipient |
| GET | `/api/requests/my` | View own requests | ✓ | Any |
| PATCH | `/api/requests/:id` | Update request | ✓ | Owner |
| GET | `/api/requests` | View all requests | ✓ | Admin |

### Donor Search Endpoints:
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/donors/nearest` | Find nearby donors | ✓ |
| POST | `/api/donors` | Register as donor | ✓ |

---

## Key Code Examples

### User Registration (Backend):
```javascript
router.post('/register', async (req, res) => {
  const { name, email, password, bloodGroup, phone, location } = req.body;
  
  // Validation & duplicate check
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) return res.status(400).json({ message: 'Email already registered' });
  
  // Create user with hashed password
  const newUser = new User({
    name, email: email.toLowerCase(), password, bloodGroup, phone, location
  });
  await newUser.save();
  
  // Return JWT token
  const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ message: 'Registration successful', token, user: newUser });
});
```

### Blood Request Creation with Notification:
```javascript
router.post('/', auth, async (req, res) => {
  if (!(req.user.role === 'recipient' || req.user.isRecipient)) {
    return res.status(403).json({ message: 'Only recipients can post requests' });
  }
  
  const newRequest = await BloodRequest.create({
    recipientId: req.user._id,
    bloodGroup, quantityRequired, hospitalName, location, urgencyLevel
  });
  
  // Notify nearby compatible donors
  const nearbyDonors = await findNearbyDonors(bloodGroup, location);
  if (nearbyDonors.length) {
    await sendNotificationsNearby(nearbyDonors, newRequest);
  }
  
  res.status(201).json(newRequest);
});
```

### Nearby Donor Search (Frontend):
```javascript
async function searchNearestDonors() {
  const selectedRegion = document.getElementById('regionSelect').value;
  const lat = userLocation.lat;
  const lng = userLocation.lng;
  
  const response = await fetch(
    `/api/donors/nearest?region=${selectedRegion}&lat=${lat}&lng=${lng}&radius=5`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  
  const { donors } = await response.json();
  displayDonorsOnMap(donors);
}
```

---

## Features Demonstrated in Viva

1. **Secure Authentication:**
   - Password hashing with bcryptjs
   - JWT token generation and validation
   - Role-based access control
   - Session management

2. **Profile Management:**
   - CRUD operations on user data
   - Data validation
   - Field-level permissions

3. **Blood Request Workflow:**
   - Request creation by recipients
   - Status state machine (4 states)
   - Status update notifications

4. **Geospatial Features:**
   - MongoDB 2dsphere indexing
   - $geoNear aggregation pipeline
   - Distance calculations
   - Region-to-coordinates mapping

5. **Notification System:**
   - Email via SMTP/Nodemailer
   - SMS via Twilio
   - Broadcast notifications
   - Error handling with fallbacks

6. **Frontend/Backend Integration:**
   - RESTful API design
   - JWT-based auth flow
   - Form validation
   - Error responses

---

## Testing Scenarios for Viva

### Test 1: User Registration & Login
```
1. Go to signup.html
2. Register with: name, email, password, blood group, phone, location
3. Go to login.html
4. Login with registered credentials
5. Verify JWT token stored and dashboard loads
```

### Test 2: Profile Update
```
1. Login as user
2. Go to profile.html
3. Update name, email, phone, location
4. Click Save
5. Verify changes persisted in database
```

### Test 3: Blood Request Creation
```
1. Login as recipient
2. Go to requests.html
3. Create request: B+ blood, 2 units, Hospital XYZ, High urgency
4. Verify request saved with status "Pending"
5. Check email notifications sent to nearby donors
```

### Test 4: Nearby Donor Search
```
1. Go to map.html
2. Select region "Gulshan"
3. Click Search
4. Verify map displays donor markers color-coded by blood group
5. Verify distance calculated from user location (23.77341, 90.42523)
```

### Test 5: Notification System
```
1. Create blood request
2. Check Email inbox / SMS received
3. Verify notification includes: blood group, location, urgency
4. Check admin dashboard for notification logs
```

---

## Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Location inaccuracy | User location set to 23.77341, 90.42523 with manual coordinate input |
| Password security | bcryptjs with 10 salt rounds + password comparison method |
| Nearby donor search complexity | MongoDB $geoNear aggregation + region mapping service |
| Email delivery | Nodemailer SMTP with fallback console logging |
| User marker repositioning | Separated userLocation (fixed) from searchLocation (dynamic) |

---

## Viva Talking Points

1. **Why bcryptjs instead of plain passwords?**
   - One-way hashing with salt rounds prevents rainbow table attacks
   - Adjustable salt rounds for future security improvements
   
2. **Why MongoDB geospatial indexing?**
   - 2dsphere index enables $geoNear aggregation
   - Efficient distance-based queries at scale
   - Native support for GeoJSON format
   
3. **Why JWT instead of sessions?**
   - Stateless authentication (easier horizontal scaling)
   - Tokens carry user identity (no database lookup needed)
   - Expiration built-in (7-day tokens)
   
4. **How does notification broadcast work?**
   - Blood request triggers findNearbyDonors() query
   - For each compatible donor, send email via Nodemailer
   - Fallback to console logging if SMTP not configured
   
5. **Why separate userLocation from searchLocation?**
   - User marker shows WHERE THEY ARE (fixed blue dot)
   - Search region shows WHERE TO FIND DONORS (doesn't move marker)
   - Previous confusion: moving marker to search region = incorrect location display

---

## Files Summary Table

| File | Lines | Purpose |
|------|-------|---------|
| routes/authRoutes.js | 197 | Register, login, profile endpoints |
| models/User.js | 60 | User schema with auth methods |
| frontend/profile.html | 674 | Profile view/edit interface |
| frontend/login.html | 206 | Login interface |
| frontend/signup.html | TBD | Registration interface |
| frontend/requests.html | TBD | Blood request posting interface |
| routes/requestRoutes.js | 181 | Blood request CRUD & notifications |
| models/BloodRequest.js | 20 | Blood request schema |
| utils/notifications.js | 80+ | Email/SMS notification service |
| frontend/map.html | 1139 | Interactive donor search map |
| utils/mapService.js | TBD | Geospatial query service |
| models/Donor.js | TBD | Donor profile with location |
| utils/regionCoordinates.js | TBD | Region-to-coordinates mapping |
| middleware/auth.js | TBD | JWT verification middleware |

---

**Total Implementation: ~2500+ lines of code across frontend and backend**

✅ All Member-1 features completed and integrated
✅ Full authentication and authorization system
✅ Complete blood request workflow
✅ Integrated notification system
✅ Geospatial donor discovery with map interface
