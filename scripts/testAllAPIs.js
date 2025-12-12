#!/usr/bin/env node

/**
 * Complete Blood Donation System API Test Suite
 * Tests all endpoints for Modules 1 & 2
 * Run: node scripts/testAPI.js
 */

const http = require('http');
const https = require('https');

const API_BASE = 'http://127.0.0.1:1320/api';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

let testResults = [];
let testTokens = {};

/**
 * Make HTTP request
 */
function makeRequest(method, path, body, token = null) {
  return new Promise((resolve, reject) => {
    try {
      const fullUrl = API_BASE + path;
      const url = new URL(fullUrl);
      const protocol = url.protocol === 'https:' ? https : http;
      
      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'BloodDonationTestSuite/1.0',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      };

      const req = protocol.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({
              status: res.statusCode,
              data: data ? JSON.parse(data) : {},
              headers: res.headers
            });
          } catch (e) {
            resolve({ status: res.statusCode, data, headers: res.headers });
          }
        });
      });

      req.on('error', (e) => {
        console.error(`Request error: ${e.message}`);
        reject(e);
      });
      
      if (body) req.write(JSON.stringify(body));
      req.end();
    } catch (e) {
      console.error(`Setup error: ${e.message}`);
      reject(e);
    }
  });
}

/**
 * Log test result
 */
function logTest(name, status, message = '') {
  const icon = status === 'pass' ? '✓' : '✗';
  const color = status === 'pass' ? colors.green : colors.red;
  console.log(`${color}${icon} ${name}${colors.reset}${message ? ' - ' + message : ''}`);
  testResults.push({ name, status, message });
}

/**
 * Test: Register User
 */
async function testRegisterUser(isDonor = true) {
  const timestamp = Date.now();
  const email = `user${timestamp}@test.com`;
  
  const body = {
    name: `Test User ${timestamp}`,
    email,
    password: 'Test123456',
    bloodGroup: 'O+',
    phone: '9876543210',
    location: 'Dhaka',
    isDonor,
    isRecipient: !isDonor
  };

  const res = await makeRequest('POST', '/auth/register', body);
  
  if (res.status === 201 && res.data.token) {
    testTokens[isDonor ? 'donor1' : 'recipient1'] = { token: res.data.token, email, ...res.data.user };
    logTest('Register User (Donor)', 'pass', `${email}`);
    return { success: true, token: res.data.token, email };
  } else {
    logTest('Register User (Donor)', 'fail', `Status: ${res.status}`);
    return { success: false };
  }
}

/**
 * Test: Login User
 */
async function testLoginUser(email, password) {
  const res = await makeRequest('POST', '/auth/login', { email, password });
  
  if (res.status === 200 && res.data.token) {
    logTest('Login User', 'pass', email);
    return { success: true, token: res.data.token };
  } else {
    logTest('Login User', 'fail', `Status: ${res.status}`);
    return { success: false };
  }
}

/**
 * Test: Get Current User Profile
 */
async function testGetProfile(token) {
  const res = await makeRequest('GET', '/auth/me', null, token);
  
  if (res.status === 200 && res.data.email) {
    logTest('Get Current User Profile', 'pass', res.data.email);
    return { success: true, user: res.data };
  } else {
    logTest('Get Current User Profile', 'fail', `Status: ${res.status}`);
    return { success: false };
  }
}

/**
 * Test: Update Profile
 */
async function testUpdateProfile(token) {
  const updateData = {
    name: 'Updated Name',
    phone: '9999999999',
    location: 'Chittagong'
  };

  const res = await makeRequest('PUT', '/auth/me', updateData, token);
  
  if (res.status === 200) {
    logTest('Update Profile', 'pass');
    return { success: true };
  } else {
    logTest('Update Profile', 'fail', `Status: ${res.status}`);
    return { success: false };
  }
}

/**
 * Test: Change Password
 */
async function testChangePassword(token) {
  const pwdData = {
    currentPassword: 'Test123456',
    newPassword: 'NewTest123456'
  };

  const res = await makeRequest('POST', '/auth/change-password', pwdData, token);
  
  if (res.status === 200) {
    logTest('Change Password', 'pass');
    return { success: true };
  } else {
    logTest('Change Password', 'fail', `Status: ${res.status}`);
    return { success: false };
  }
}

/**
 * Test: Create Donor Profile
 */
async function testCreateDonor(token) {
  const donorData = {
    name: 'John Donor',
    bloodGroup: 'O+',
    location: 'Dhaka',
    phone: '9876543210'
  };

  const res = await makeRequest('POST', '/donors', donorData, token);
  
  if (res.status === 201 && res.data._id) {
    testTokens.donorId = res.data._id;
    logTest('Create Donor Profile', 'pass', res.data._id);
    return { success: true, donorId: res.data._id };
  } else {
    logTest('Create Donor Profile', 'fail', `Status: ${res.status}`);
    return { success: false };
  }
}

/**
 * Test: Search Donors (Public)
 */
async function testSearchDonors() {
  const res = await makeRequest('GET', '/donors/search?bloodGroup=O%2B&location=Dhaka', null);
  
  if (res.status === 200 && Array.isArray(res.data)) {
    logTest('Search Donors (Public)', 'pass', `Found ${res.data.length} donors`);
    return { success: true, donors: res.data };
  } else {
    logTest('Search Donors (Public)', 'fail', `Status: ${res.status}`);
    return { success: false };
  }
}

/**
 * Test: Update Donor Availability
 */
async function testUpdateDonorAvailability(token, donorId) {
  const availData = {
    availabilityStatus: 'Available',
    lastDonationDate: new Date().toISOString().split('T')[0]
  };

  const res = await makeRequest('PATCH', `/donors/${donorId}/availability`, availData, token);
  
  if (res.status === 200) {
    logTest('Update Donor Availability', 'pass');
    return { success: true };
  } else {
    logTest('Update Donor Availability', 'fail', `Status: ${res.status}`);
    return { success: false };
  }
}

/**
 * Test: Create Blood Request
 */
async function testCreateRequest(token) {
  const requestData = {
    bloodGroup: 'O+',
    quantityRequired: 2,
    hospitalName: 'City Hospital',
    location: 'Dhaka',
    urgencyLevel: 'High',
    neededBefore: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  };

  const res = await makeRequest('POST', '/requests', requestData, token);
  
  if (res.status === 201 && res.data._id) {
    testTokens.requestId = res.data._id;
    logTest('Create Blood Request', 'pass', res.data._id);
    return { success: true, requestId: res.data._id };
  } else {
    logTest('Create Blood Request', 'fail', `Status: ${res.status}`);
    return { success: false };
  }
}

/**
 * Test: View User's Requests
 */
async function testViewMyRequests(token) {
  const res = await makeRequest('GET', '/requests/my', null, token);
  
  if (res.status === 200 && Array.isArray(res.data)) {
    logTest('View My Requests', 'pass', `${res.data.length} requests`);
    return { success: true, requests: res.data };
  } else {
    logTest('View My Requests', 'fail', `Status: ${res.status}`);
    return { success: false };
  }
}

/**
 * Test: Update Request Status
 */
async function testUpdateRequestStatus(token, requestId) {
  const updateData = {
    status: 'Approved'
  };

  const res = await makeRequest('PATCH', `/requests/${requestId}`, updateData, token);
  
  if (res.status === 200) {
    logTest('Update Request Status', 'pass');
    return { success: true };
  } else {
    logTest('Update Request Status', 'fail', `Status: ${res.status}`);
    return { success: false };
  }
}

/**
 * Test: Get Dashboard (User)
 */
async function testUserDashboard(token) {
  const res = await makeRequest('GET', '/dashboard/user', null, token);
  
  if (res.status === 200) {
    logTest('Get User Dashboard', 'pass');
    return { success: true, data: res.data };
  } else {
    logTest('Get User Dashboard', 'fail', `Status: ${res.status}`);
    return { success: false };
  }
}

/**
 * Test: Get Dashboard (Admin)
 */
async function testAdminDashboard(token) {
  const res = await makeRequest('GET', '/dashboard/admin', null, token);
  
  if (res.status === 200) {
    logTest('Get Admin Dashboard', 'pass');
    return { success: true, data: res.data };
  } else {
    logTest('Get Admin Dashboard', 'fail', `Status: ${res.status}`);
    return { success: false };
  }
}

/**
 * Test: List All Donors (Admin)
 */
async function testListAllDonors(token) {
  const res = await makeRequest('GET', '/donors', null, token);
  
  if (res.status === 200 && Array.isArray(res.data)) {
    logTest('List All Donors (Admin)', 'pass', `${res.data.length} donors`);
    return { success: true, donors: res.data };
  } else {
    logTest('List All Donors (Admin)', 'fail', `Status: ${res.status}`);
    return { success: false };
  }
}

/**
 * Test: Approve/Reject Donor (Admin)
 */
async function testApproveDonor(token, donorId) {
  const approvalData = {
    status: 'Approved'
  };

  const res = await makeRequest('PATCH', `/donors/${donorId}/status`, approvalData, token);
  
  if (res.status === 200) {
    logTest('Approve Donor (Admin)', 'pass');
    return { success: true };
  } else {
    logTest('Approve Donor (Admin)', 'fail', `Status: ${res.status}`);
    return { success: false };
  }
}

/**
 * Test: List All Requests (Admin)
 */
async function testListAllRequests(token) {
  const res = await makeRequest('GET', '/requests', null, token);
  
  if (res.status === 200 && Array.isArray(res.data)) {
    logTest('List All Requests (Admin)', 'pass', `${res.data.length} requests`);
    return { success: true, requests: res.data };
  } else {
    logTest('List All Requests (Admin)', 'fail', `Status: ${res.status}`);
    return { success: false };
  }
}

/**
 * Main Test Suite
 */
async function runTests() {
  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.cyan}  Blood Donation System - Complete API Test Suite${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);

  try {
    // MODULE 1: PROFILE MANAGEMENT
    console.log(`${colors.blue}MODULE 1: Profile Management${colors.reset}\n`);

    let donorReg = await testRegisterUser(true);
    if (!donorReg.success) return;

    let recipientReg = await testRegisterUser(false);
    if (!recipientReg.success) return;

    let login = await testLoginUser(donorReg.email, 'Test123456');
    if (!login.success) return;

    let profile = await testGetProfile(donorReg.token);
    if (!profile.success) return;

    let update = await testUpdateProfile(donorReg.token);
    if (!update.success) return;

    // Note: Skip password change to keep token valid for further tests
    // let pwd = await testChangePassword(donorReg.token);

    // MODULE 2: BLOOD REQUEST & DONOR MANAGEMENT
    console.log(`\n${colors.blue}MODULE 2: Blood Request & Donor Management${colors.reset}\n`);

    let donor = await testCreateDonor(donorReg.token);
    if (!donor.success) return;

    let search = await testSearchDonors();

    let avail = await testUpdateDonorAvailability(donorReg.token, donor.donorId);

    let request = await testCreateRequest(recipientReg.token);
    if (!request.success) return;

    let myReq = await testViewMyRequests(recipientReg.token);

    let reqUpdate = await testUpdateRequestStatus(recipientReg.token, request.requestId);

    let userDash = await testUserDashboard(recipientReg.token);

    // ADMIN FUNCTIONS (requires admin token - will fail without promotion)
    console.log(`\n${colors.blue}ADMIN FUNCTIONS (Requires Admin Role)${colors.reset}\n`);

    await testListAllDonors(donorReg.token); // Will fail without admin
    await testApproveDonor(donorReg.token, donor.donorId); // Will fail without admin
    await testListAllRequests(donorReg.token); // Will fail without admin
    await testAdminDashboard(donorReg.token); // Will fail without admin

  } catch (error) {
    console.error(`${colors.red}Fatal Error: ${error.message}${colors.reset}`);
  }

  // SUMMARY
  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.cyan}TEST SUMMARY${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);

  const passed = testResults.filter(t => t.status === 'pass').length;
  const failed = testResults.filter(t => t.status === 'fail').length;

  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`Total: ${testResults.length}\n`);

  // Detailed results
  console.log(`${colors.cyan}Detailed Results:${colors.reset}\n`);
  testResults.forEach((result, i) => {
    const status = result.status === 'pass' ? colors.green + '✓' : colors.red + '✗';
    console.log(`${i + 1}. ${status}${colors.reset} ${result.name}`);
    if (result.message) console.log(`   Message: ${result.message}`);
  });

  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);

  // Print test tokens for manual testing
  console.log(`${colors.cyan}Test Tokens (for manual API testing):${colors.reset}\n`);
  Object.entries(testTokens).forEach(([key, value]) => {
    if (typeof value === 'object' && value.token) {
      console.log(`${colors.yellow}${key}:${colors.reset}`);
      console.log(`  Token: ${value.token.substring(0, 50)}...`);
      console.log(`  Email: ${value.email || 'N/A'}`);
    }
  });

  console.log('\n');
}

// Run tests
runTests().catch(console.error);
