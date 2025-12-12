# 🩸 Blood Management System

A comprehensive blood donation management platform that connects donors with recipients, streamlines blood requests, and provides administrative tools for efficient blood donation center operations.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Team Collaboration Guide](#team-collaboration-guide)
- [Module Assignments](#module-assignments)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Git Workflow](#git-workflow)
- [Testing](#testing)

## ✨ Features

### Module 1: Profile Management
- **User Authentication**: Secure signup, login, and logout with role-based access (donor, recipient, admin)
- **Profile Management**: View and update personal information (name, email, phone, location, blood group)
- **Password Management**: Secure password change functionality
- **Admin Role Management**: Assign roles, approve donors, deactivate inactive users
- **Donor Search**: Filter donors by blood group and location with availability status

### Module 2: Blood Request and Donor Management
- **Blood Requests**: Post and manage blood requests with urgency levels and status tracking
- **Request Status**: Track request lifecycle (Pending, Approved, Fulfilled, Cancelled)
- **Admin Approval System**: Review and approve donor registrations and blood requests
- **System Monitoring**: Dashboard with donor availability and active request statistics
- **Donor Availability**: Manage availability status and last donation date tracking

## 🛠 Tech Stack

**Backend:**
- Node.js (v18+)
- Express.js (v5.2.1)
- MongoDB (Mongoose v9.0.0)
- JWT Authentication (jsonwebtoken v9.0.0)
- bcryptjs (v2.4.3) for password hashing

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Responsive design with modern UI
- Leaflet.js for maps (locally vendored)

**Development:**
- dotenv for environment variables
- nodemon for development server
- CORS enabled

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (v6.0+) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/downloads)
- **Code Editor** (VS Code recommended)

## 🚀 Installation

### 1. Clone the Repository

```powershell
# Clone from GitHub
git clone https://github.com/YOUR-USERNAME/blood-management-system.git

# Navigate to project directory
cd blood-management-system
```

### 2. Install Dependencies

```powershell
npm install
```

This will install all required packages listed in `package.json`:
- express
- mongoose
- cors
- jsonwebtoken
- bcryptjs
- dotenv
- nodemon (dev dependency)

## ⚙️ Environment Setup

### 1. Create Environment File

```powershell
# Copy the example environment file
copy .env.example .env
```

### 2. Configure Environment Variables

Open `.env` in your text editor and update with your values:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/blood_donation_db
PORT=1320
JWT_SECRET=your-secret-key-change-this
```

**Important:** Never commit `.env` file to GitHub (it's in `.gitignore`)

### 3. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```powershell
# If MongoDB is installed as a service, it should auto-start
# Or manually start:
mongod
```

**Mac/Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongod
# or
brew services start mongodb-community
```

## 🎮 Running the Application

### Development Mode (with auto-restart)

```powershell
npm run dev
```

### Production Mode

```powershell
npm start
```

### Access the Application

Once the server is running, you'll see:
```
Server running on port 1320
MongoDB connected
```

Open your browser and navigate to:
- **Frontend**: http://127.0.0.1:1320/
- **API Base**: http://127.0.0.1:1320/api/

### Available Pages

- `/` - Homepage
- `/login.html` - User login
- `/signup.html` - New user registration
- `/profile.html` - User profile management
- `/requests.html` - Blood request management
- `/donors.html` - Donor search and list
- `/dashboard.html` - Analytics dashboard
- `/admin.html` - Admin panel

## 👥 Team Collaboration Guide

### Team Structure

- **Member 1**: Authentication & Blood Requests
- **Member 2**: Admin Functions & Approvals
- **Member 3**: Donor Search & Availability

### Setting Up for Collaboration

#### For Repository Owner (First Time)

1. Create GitHub repository
2. Add team members as collaborators (Settings → Collaborators)
3. Push initial code:
   ```powershell
   git init
   git add .
   git commit -m "Initial project setup"
   git remote add origin https://github.com/YOUR-USERNAME/blood-management-system.git
   git branch -M main
   git push -u origin main
   ```

#### For Team Members (First Time)

1. Accept GitHub collaboration invitation
2. Clone repository:
   ```powershell
   git clone https://github.com/YOUR-USERNAME/blood-management-system.git
   cd blood-management-system
   ```
3. Install dependencies: `npm install`
4. Setup environment: `copy .env.example .env` and configure
5. Start MongoDB
6. Run application: `npm start`

### Branch Protection (Recommended)

1. Go to repo **Settings** → **Branches**
2. Add rule for `main` branch
3. Enable:
   - ✅ Require pull request before merging
   - ✅ Require approvals (minimum 1)
   - ✅ Dismiss stale pull request approvals when new commits are pushed

## 📂 Module Assignments

### Member 1: Authentication & Blood Requests

**Branches:** `feature/profile-auth`, `feature/blood-requests`

**Responsibilities:**
1. User signup/login/logout with JWT
2. Profile view and update
3. Change password functionality
4. Create and manage personal blood requests
5. Request status tracking

**Files to Modify:**
- `routes/authRoutes.js`
- `models/User.js`
- `middleware/auth.js`
- `routes/requestRoutes.js`
- `models/BloodRequest.js`
- `frontend/login.html`, `signup.html`, `profile.html`, `requests.html`

**API Endpoints to Implement:**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/requests` - Create blood request
- `GET /api/requests/mine` - View own requests
- `PATCH /api/requests/:id` - Update/cancel request

### Member 2: Admin Functions & System Monitoring

**Branches:** `feature/admin-roles`, `feature/admin-approvals`

**Responsibilities:**
1. Admin role management
2. User activation/deactivation
3. Donor approval system
4. Blood request approvals
5. System monitoring dashboard

**Files to Modify:**
- `middleware/auth.js` (add role checks)
- `routes/authRoutes.js` (admin endpoints)
- `routes/donorRoutes.js` (approval endpoints)
- `routes/requestRoutes.js` (admin actions)
- `routes/dashboardRoutes.js`
- `frontend/admin.html`, `dashboard.html`

**API Endpoints to Implement:**
- `PUT /api/auth/users/:id/role` - Assign user role
- `PUT /api/auth/users/:id/status` - Activate/deactivate user
- `GET /api/donors/pending` - List pending donor approvals
- `PUT /api/donors/:id/approve` - Approve donor
- `GET /api/requests/all` - View all requests (admin)
- `PUT /api/requests/:id/approve` - Approve request
- `PUT /api/requests/:id/fulfill` - Mark as fulfilled
- `GET /api/dashboard/stats` - System statistics

### Member 3: Donor Search & Availability

**Branches:** `feature/donor-search`, `feature/donor-availability`

**Responsibilities:**
1. Donor search by blood group and location
2. Donor profile display with availability
3. Donor availability status management
4. Last donation date tracking
5. Search UI implementation

**Files to Modify:**
- `routes/donorRoutes.js`
- `models/Donor.js` (add availability fields)
- `utils/regionCoordinates.js`
- `frontend/donors.html`

**API Endpoints to Implement:**
- `GET /api/donors/search` - Search donors (query: bloodGroup, region/city)
- `GET /api/donors/:id` - Get donor profile
- `PUT /api/donors/me/availability` - Update own availability
- Add to Donor schema:
  - `availabilityStatus`: enum ['Available', 'Unavailable', 'Donated Recently']
  - `lastDonationDate`: Date

**Schema Updates:**
```javascript
// Add to models/Donor.js
availabilityStatus: {
  type: String,
  enum: ['Available', 'Unavailable', 'Donated Recently'],
  default: 'Available'
},
lastDonationDate: {
  type: Date,
  default: null
}
```

## 📁 Project Structure

```
blood-management-system/
├── frontend/                 # Frontend files
│   ├── css/                 # Stylesheets
│   │   └── style.css
│   ├── js/                  # JavaScript files
│   │   ├── app.js
│   │   └── leaflet/         # Leaflet map library (local)
│   ├── images/              # Image assets
│   ├── index.html           # Homepage
│   ├── login.html           # Login page
│   ├── signup.html          # Registration page
│   ├── profile.html         # User profile
│   ├── requests.html        # Blood requests
│   ├── donors.html          # Donor search
│   ├── dashboard.html       # Dashboard
│   └── admin.html           # Admin panel
├── routes/                  # API routes
│   ├── authRoutes.js        # Authentication endpoints
│   ├── donorRoutes.js       # Donor management
│   ├── requestRoutes.js     # Blood requests
│   └── dashboardRoutes.js   # Dashboard stats
├── models/                  # Mongoose schemas
│   ├── User.js              # User model
│   ├── Donor.js             # Donor model
│   └── BloodRequest.js      # Blood request model
├── middleware/              # Custom middleware
│   └── auth.js              # JWT authentication
├── utils/                   # Utility functions
│   ├── regionCoordinates.js # Location utilities
│   └── notifications.js     # Notification helpers
├── scripts/                 # Utility scripts
│   └── seedDonors.js        # Seed database
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
├── server.js                # Express server
└── README.md                # This file
```

## 🔌 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "bloodGroup": "O+",
  "phone": "01712345678",
  "location": "Dhaka",
  "role": "donor"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response: { "token": "jwt-token", "user": {...} }
```

#### Get Profile
```http
GET /api/auth/me
Authorization: Bearer <jwt-token>
```

### Donor Endpoints

#### Search Donors
```http
GET /api/donors/search?bloodGroup=O+&region=dhaka
```

#### Get Donor by ID
```http
GET /api/donors/:id
```

#### Update Availability (Authenticated)
```http
PUT /api/donors/me/availability
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "availabilityStatus": "Available",
  "lastDonationDate": "2025-12-01"
}
```

### Request Endpoints

#### Create Blood Request
```http
POST /api/requests
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "bloodGroup": "A+",
  "quantity": 2,
  "hospitalName": "Dhaka Medical College",
  "urgency": "high",
  "notes": "Emergency surgery required"
}
```

#### Get My Requests
```http
GET /api/requests/mine
Authorization: Bearer <jwt-token>
```

### Admin Endpoints

#### Get All Requests (Admin)
```http
GET /api/requests/all
Authorization: Bearer <jwt-token>
```

#### Approve Request (Admin)
```http
PUT /api/requests/:id/approve
Authorization: Bearer <jwt-token>
```

#### Dashboard Stats (Admin)
```http
GET /api/dashboard/stats
Authorization: Bearer <jwt-token>
```

## 🔄 Git Workflow

### Daily Workflow

```powershell
# 1. Update main branch
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes and commit
git add .
git commit -m "Description of changes"

# 4. Push to GitHub
git push -u origin feature/your-feature-name

# 5. Create Pull Request on GitHub
# 6. Request review from teammates
# 7. Merge after approval
```

### Best Practices

✅ **DO:**
- Pull latest `main` before creating new branch
- Use descriptive branch names: `feature/`, `bugfix/`, `hotfix/`
- Write clear commit messages
- Test before pushing
- Request code reviews
- Run `npm install` after pulling changes

❌ **DON'T:**
- Push directly to `main`
- Commit `.env` file
- Commit `node_modules/`
- Work on same files without communication
- Merge own PRs without review

### Common Commands

```powershell
# Check current branch
git branch

# Switch branches
git checkout branch-name

# See changes
git status
git diff

# Discard local changes
git checkout -- filename

# Update from remote
git pull

# View commit history
git log --oneline

# Delete local branch
git branch -d feature/old-branch
```

### Resolving Merge Conflicts

```powershell
# Update main
git checkout main
git pull origin main

# Merge into your branch
git checkout feature/your-branch
git merge main

# If conflicts, edit files manually
# Look for <<<<<<< HEAD markers
# Keep correct code, remove markers

# After fixing
git add .
git commit -m "Resolve merge conflicts"
git push
```

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] User can signup with valid data
- [ ] Login returns JWT token
- [ ] Protected routes require authentication
- [ ] Profile page shows user data
- [ ] Profile update works correctly
- [ ] Change password validates old password

**Blood Requests:**
- [ ] User can create blood request
- [ ] User can view own requests
- [ ] User can update request status
- [ ] Admin can view all requests
- [ ] Admin can approve requests

**Donor Management:**
- [ ] Search filters by blood group
- [ ] Search filters by location
- [ ] Donor profile displays correctly
- [ ] Availability status updates
- [ ] Last donation date saves

**Admin Functions:**
- [ ] Admin can view all users
- [ ] Admin can change user roles
- [ ] Admin can approve donors
- [ ] Dashboard shows correct statistics

### API Testing with Postman

1. Import API collection (if provided)
2. Set environment variable `baseUrl` to `http://127.0.0.1:1320`
3. Login to get JWT token
4. Add token to Authorization header for protected routes
5. Test all endpoints

### Database Testing

```powershell
# Connect to MongoDB
mongosh

# Use database
use blood_donation_db

# View collections
show collections

# Query users
db.users.find().pretty()

# Query donors
db.donors.find({ bloodGroup: "O+" }).pretty()

# Query requests
db.bloodrequests.find({ status: "Pending" }).pretty()
```

## 🤝 Contributing

1. Choose a feature from your assigned module
2. Create a feature branch
3. Implement and test thoroughly
4. Commit with clear messages
5. Push and create Pull Request
6. Request review from at least 1 teammate
7. Address review comments
8. Merge after approval

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Team

- **Member 1**: Authentication & Blood Requests
- **Member 2**: Admin Functions & System Monitoring
- **Member 3**: Donor Search & Availability Management

## 📞 Support

For issues or questions:
1. Check existing GitHub Issues
2. Create new issue with detailed description
3. Tag relevant team member
4. Discuss in team meetings

## 🔐 Security Notes

- Never commit `.env` file
- Keep JWT_SECRET secure and unique
- Use strong passwords (minimum 8 characters)
- Implement rate limiting for production
- Validate all user inputs
- Sanitize database queries
- Use HTTPS in production

## 🚀 Deployment (Future)

For production deployment:
- Use MongoDB Atlas for database
- Deploy to Heroku, Render, or Railway
- Set environment variables on hosting platform
- Enable HTTPS
- Implement rate limiting
- Set up monitoring and logging

---

**Happy Coding! 🎉**

Last Updated: December 12, 2025
