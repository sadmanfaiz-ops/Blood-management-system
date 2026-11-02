# Blood Management System

A web-based blood donation platform that connects donors and recipients, manages blood requests, and helps administrators monitor donation activity.

## Features

- User registration, login, profile management, and role-based access
- Donor registration, approval, availability, and blood-group management
- Blood request creation and status tracking
- Nearby donor search using region or geographic coordinates
- Interactive donor map with Leaflet and OpenStreetMap
- Email and optional SMS notifications
- Admin dashboard with analytics and notification statistics
- Static frontend served directly by the Express backend

## Technology Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT and bcrypt
- **Frontend:** HTML, CSS, and vanilla JavaScript
- **Mapping:** Leaflet and OpenStreetMap
- **Notifications:** Nodemailer and optional Twilio integration

## Requirements

- Node.js 18 or newer
- MongoDB running locally or a MongoDB connection string

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create an environment file:

   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your MongoDB connection string and a secure JWT secret:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/blood_donation_db
   PORT=1320
   JWT_SECRET=replace-with-a-secure-secret
   ```

   SMTP and Twilio settings are optional. Configure them if email or SMS notifications are required.

4. Start the server:

   ```bash
   npm start
   ```

   For development with automatic restarts:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:1320](http://localhost:1320) in a browser.

## API Overview

The backend exposes these route groups:

| Route | Purpose |
| --- | --- |
| `/api/auth` | Registration, login, profiles, passwords, and user administration |
| `/api/donors` | Donor registration, search, availability, and approval |
| `/api/requests` | Blood request creation and status management |
| `/api/dashboard` | User and administrator dashboard data |
| `/api/analytics` | Administrator analytics and notification statistics |

Protected endpoints require a JWT in the `Authorization` header:

```text
Authorization: Bearer <token>
```

## Project Structure

```text
.
├── frontend/       # HTML pages, styles, JavaScript, and Leaflet assets
├── middleware/     # Authentication and authorization middleware
├── models/         # Mongoose schemas
├── routes/         # Express API routes
├── utils/          # Mapping, analytics, notifications, and region helpers
├── .env.example    # Environment variable template
└── server.js       # Express server entry point
```

## Supporting Documentation

- [Map Feature Guide](MAP_FEATURE_GUIDE.md)
- [Analytics API](ANALYTICS_API.md)
- [Frontend README](frontend/README.md)

## License

This project is released under the ISC license.
