# 🔧 API Testing Guide - Fixed & Working

## ✅ Status: All Auth APIs Working!

Both **Signup** and **Login** are now fully functional. The "next is not a function" error has been fixed.

---

## What Was Fixed

### 1. **User.js Pre-Save Hook Error**
**Problem:** The Mongoose pre-save hook was using an incorrect async pattern with `next()` parameter causing conflicts.

**Solution:** Changed from callback-style to modern async/await:
```javascript
// BEFORE (Caused error)
userSchema.pre('save', async function(next) {
  // ...
  next();
})

// AFTER (Works correctly)
userSchema.pre('save', async function() {
  try {
    // async logic
  } catch(error) {
    throw error;
  }
})
```

### 2. **Enhanced Error Logging**
Added detailed console logs to trace signup/login flow:
- Email validation
- Duplicate email checking
- Password hashing progress
- Password comparison results

### 3. **Improved Response Messages**
- Signup now returns detailed user object with all fields
- Login now returns role information
- Better error messages for validation failures

---

## 🧪 Test The APIs

### **Option 1: Web Test Panel (Easiest)**
Visit: **http://127.0.0.1:3000/test.html**

Features:
- Pre-filled test data
- 5 tabs (Auth, Profile, Donors, Requests, Admin)
- Auto-token copying between forms
- Visual success/error responses

### **Option 2: PowerShell Command**

**Signup:**
```powershell
$email = "user_$(Get-Random -Minimum 100000 -Maximum 999999)@test.com"
$body = @{
    name="Test User"
    email=$email
    password="Test123456"
    bloodGroup="O+"
    phone="9876543210"
    location="Dhaka"
    isDonor=$true
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://127.0.0.1:1320/api/auth/register' -Method POST -ContentType 'application/json' -Body $body
$response.Content | ConvertFrom-Json | ConvertTo-Json
```

**Login:**
```powershell
$email = "user_335653@test.com"  # Use email from signup
$body = @{email=$email; password="Test123456"} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://127.0.0.1:1320/api/auth/login' -Method POST -ContentType 'application/json' -Body $body
$response.Content | ConvertFrom-Json | ConvertTo-Json
```

### **Option 3: Browser Console**

Open **http://127.0.0.1:3000/test.html** and paste:
```javascript
const timestamp = Date.now();
const email = `test${timestamp}@test.com`;

fetch('http://127.0.0.1:1320/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: email,
    password: 'Test123456',
    bloodGroup: 'O+',
    phone: '9876543210',
    location: 'Dhaka',
    isDonor: true
  })
})
.then(r => r.json())
.then(d => { console.log('✓ Signup:', d); window.testToken = d.token; })
.catch(e => console.error('✗ Error:', e))
```

Then login:
```javascript
fetch('http://127.0.0.1:1320/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test1234567890@test.com',  // Use your signup email
    password: 'Test123456'
  })
})
.then(r => r.json())
.then(d => console.log('✓ Login:', d))
.catch(e => console.error('✗ Error:', e))
```

---

## 📊 Expected Responses

### Signup Success (201)
```json
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "693adb9e6267cec600f39f8c",
    "name": "Test User",
    "email": "user_335653@test.com",
    "bloodGroup": "O+",
    "phone": "9876543210",
    "location": "Dhaka",
    "isDonor": true,
    "isRecipient": false
  }
}
```

### Login Success (200)
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "693adb9e6267cec600f39f8c",
    "name": "Test User",
    "email": "user_335653@test.com",
    "bloodGroup": "O+",
    "phone": "9876543210",
    "location": "Dhaka",
    "role": "donor",
    "isDonor": true,
    "isRecipient": false
  }
}
```

### Signup Errors

**Duplicate Email (400):**
```json
{
  "message": "Email already registered"
}
```

**Missing Fields (400):**
```json
{
  "message": "All fields are required",
  "details": ["Field name is required"]
}
```

### Login Errors

**Invalid Email/Password (401):**
```json
{
  "message": "Invalid email or password"
}
```

---

## 🔐 Using the Token

After signup/login, save the token and use it for authenticated requests:

```powershell
$token = "eyJhbGciOiJIUzI1NiIs..."

# Get current user
$response = Invoke-WebRequest -Uri 'http://127.0.0.1:1320/api/auth/me' `
  -Method GET `
  -Headers @{ Authorization = "Bearer $token" }

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

---

## 🚀 Servers Running On

- **Backend API:** http://127.0.0.1:1320
- **Frontend:** http://127.0.0.1:3000
- **Test Panel:** http://127.0.0.1:3000/test.html

---

## ✨ Next Steps

All auth APIs are confirmed working! You can now:

1. **✅ Test Profile Management** (GET /me, PUT /me, POST /change-password)
2. **✅ Test Donor Management** (POST /donors, GET /donors/search, PATCH availability)
3. **✅ Test Blood Requests** (POST /requests, GET /requests/my, PATCH status)
4. **✅ Test Admin Functions** (List donors, approve donors, admin dashboard)

Use the **test.html** panel to test all remaining endpoints!
