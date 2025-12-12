#!/usr/bin/env node
/**
 * Blood Donation System - API Test Suite
 * Run with: node scripts/testAPI.js
 */

const BASE_URL = 'http://127.0.0.1:1320/api';

let testUser = null;
let testToken = null;
let testDonor = null;
let testRequest = null;

const log = (title, msg, isError = false) => {
  const prefix = isError ? '❌' : '✅';
  console.log(`${prefix} ${title}: ${msg}`);
};

async function request(method, endpoint, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (testToken) options.headers.Authorization = `Bearer ${testToken}`;
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('\n========== BLOOD DONATION API TEST SUITE ==========\n');

  // MODULE 1: PROFILE MANAGEMENT
  console.log('--- MODULE 1: PROFILE MANAGEMENT ---\n');

  // Test 1.1: Register User
  console.log('Test 1.1: User Registration');
  testUser = {
    name: 'Test Donor',
    email: `testdonor${Date.now()}@example.com`,
    password: 'TestPass123!',
    bloodGroup: 'O+',
    phone: '9876543210',
    location: 'Dhaka',
    isDonor: true,
    isRecipient: false
  };
  let res = await request('POST', '/auth/register', testUser);
  if (res.ok) {
    testToken = res.data.token;
    log('REGISTER', 'User created successfully', false);
  } else {
    log('REGISTER', `Failed: ${res.data.message}`, true);
    console.log('Response:', res.data);
    return;
  }

  // Test 1.2: Login User
  console.log('\nTest 1.2: User Login');
  res = await request('POST', '/auth/login', {
    email: testUser.email,
    password: testUser.password
  });
  if (res.ok && res.data.token) {
    testToken = res.data.token;
    log('LOGIN', 'Login successful', false);
  } else {
    log('LOGIN', `Failed: ${res.data.message}`, true);
    return;
  }

  // Test 1.3: Get Current User
  console.log('\nTest 1.3: Get Current User Profile');
  res = await request('GET', '/auth/me');
  if (res.ok && res.data.id) {
    log('GET_ME', 'Profile retrieved', false);
  } else {
    log('GET_ME', `Failed: ${res.data.message}`, true);
  }

  // Test 1.4: Update Profile
  console.log('\nTest 1.4: Update User Profile');
  res = await request('PUT', '/auth/me', {
    name: 'Updated Donor Name',
    phone: '9876543211',
    location: 'Chittagong'
  });
  if (res.ok) {
    log('UPDATE_PROFILE', 'Profile updated successfully', false);
  } else {
    log('UPDATE_PROFILE', `Failed: ${res.data.message}`, true);
  }

  // Test 1.5: Change Password
  console.log('\nTest 1.5: Change Password');
  res = await request('POST', '/auth/change-password', {
    currentPassword: testUser.password,
    newPassword: 'NewTestPass123!'
  });
  if (res.ok) {
    log('CHANGE_PASSWORD', 'Password changed successfully', false);
    testUser.password = 'NewTestPass123!';
  } else {
    log('CHANGE_PASSWORD', `Failed: ${res.data.message}`, true);
  }

  // MODULE 2: BLOOD REQUEST AND DONOR MANAGEMENT
  console.log('\n--- MODULE 2: BLOOD REQUEST & DONOR MANAGEMENT ---\n');

  // Test 2.1: Create Donor Profile
  console.log('Test 2.1: Create Donor Profile');
  res = await request('POST', '/donors', {
    name: 'Test Donor',
    bloodGroup: 'O+',
    location: 'Dhaka',
    phone: '9876543210'
  });
  if (res.ok && res.data._id) {
    testDonor = res.data;
    log('CREATE_DONOR', 'Donor profile created', false);
  } else {
    log('CREATE_DONOR', `Failed: ${res.data.message}`, true);
  }

  // Test 2.2: Search Donors
  console.log('\nTest 2.2: Search Donors');
  res = await request('GET', '/donors/search?bloodGroup=O%2B&location=Dhaka');
  if (res.ok && Array.isArray(res.data)) {
    log('SEARCH_DONORS', `Found ${res.data.length} donors`, false);
  } else {
    log('SEARCH_DONORS', `Failed: ${res.data.message}`, true);
  }

  // Test 2.3: Create Blood Request
  console.log('\nTest 2.3: Create Blood Request');
  res = await request('POST', '/requests', {
    bloodGroup: 'O+',
    quantityRequired: 2,
    hospitalName: 'City Hospital',
    location: 'Dhaka',
    urgencyLevel: 'High',
    neededBefore: '2025-12-31'
  });
  if (res.ok && res.data._id) {
    testRequest = res.data;
    log('CREATE_REQUEST', 'Blood request created', false);
  } else {
    log('CREATE_REQUEST', `Failed: ${res.data.message}`, true);
  }

  // Test 2.4: View My Requests
  console.log('\nTest 2.4: View My Requests');
  res = await request('GET', '/requests/my');
  if (res.ok && Array.isArray(res.data)) {
    log('MY_REQUESTS', `Found ${res.data.length} requests`, false);
  } else {
    log('MY_REQUESTS', `Failed: ${res.data.message}`, true);
  }

  // Test 2.5: Update Request Status
  if (testRequest) {
    console.log('\nTest 2.5: Update Request Status');
    res = await request('PATCH', `/requests/${testRequest._id}`, {
      status: 'Fulfilled'
    });
    if (res.ok) {
      log('UPDATE_REQUEST', 'Request status updated', false);
    } else {
      log('UPDATE_REQUEST', `Failed: ${res.data.message}`, true);
    }
  }

  // Test 2.6: Update Donor Availability
  if (testDonor) {
    console.log('\nTest 2.6: Update Donor Availability');
    res = await request('PATCH', `/donors/${testDonor._id}/availability`, {
      availability: true,
      availabilityStatus: 'Available',
      lastDonationDate: '2025-12-01'
    });
    if (res.ok) {
      log('UPDATE_AVAILABILITY', 'Donor availability updated', false);
    } else {
      log('UPDATE_AVAILABILITY', `Failed: ${res.data.message}`, true);
    }
  }

  console.log('\n========== TEST SUITE COMPLETE ==========\n');
  process.exit(0);
}

// Run tests
runTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
