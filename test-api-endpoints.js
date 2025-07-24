#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'https://docky-backend-b9a1.onrender.com';

// Test data
const testUsers = {
  admin: { email: 'admin@gmail.com', password: 'admin123' },
  user: { email: 'user@gmail.com', password: 'user123' },
  john: { email: 'john@gmail.com', password: 'john123' }
};

let adminToken = '';
let userToken = '';

async function testEndpoint(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    console.log(`✅ ${method} ${endpoint} - Status: ${response.status}`);
    return response.data;
  } catch (error) {
    console.log(`❌ ${method} ${endpoint} - Status: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting API Endpoint Tests...\n');

  // Test 1: Health Check
  console.log('1. Testing Health Check:');
  await testEndpoint('GET', '/health');
  console.log('');

  // Test 2: Database Test
  console.log('2. Testing Database:');
  await testEndpoint('GET', '/api/test-db');
  console.log('');

  // Test 3: Auth Endpoints
  console.log('3. Testing Auth Endpoints:');
  
  // Test user login
  const userLoginResult = await testEndpoint('POST', '/api/auth/login', testUsers.user);
  if (userLoginResult?.data?.token) {
    userToken = userLoginResult.data.token;
    console.log('   User token obtained');
  }

  // Test admin login
  const adminLoginResult = await testEndpoint('POST', '/api/auth/admin/login', testUsers.admin);
  if (adminLoginResult?.data?.token) {
    adminToken = adminLoginResult.data.token;
    console.log('   Admin token obtained');
  }

  // Test user registration
  await testEndpoint('POST', '/api/auth/register', {
    name: 'Test User 2',
    email: 'test2@gmail.com',
    password: 'test123',
    role: 'user'
  });
  console.log('');

  // Test 4: Protected Auth Endpoints
  console.log('4. Testing Protected Auth Endpoints:');
  await testEndpoint('GET', '/api/auth/profile', null, userToken);
  await testEndpoint('GET', '/api/auth/admin-users', null, adminToken);
  console.log('');

  // Test 5: Document Endpoints (User)
  console.log('5. Testing Document Endpoints (User):');
  await testEndpoint('GET', '/api/documents/my-documents', null, userToken);
  console.log('');

  // Test 6: Document Endpoints (Admin)
  console.log('6. Testing Document Endpoints (Admin):');
  await testEndpoint('GET', '/api/documents/admin/all-documents', null, adminToken);
  await testEndpoint('POST', '/api/documents/admin/user-documents', { email: 'user@gmail.com' }, adminToken);
  console.log('');

  // Test 7: Message Endpoints (User)
  console.log('7. Testing Message Endpoints (User):');
  await testEndpoint('GET', '/api/messages/inbox', null, userToken);
  await testEndpoint('GET', '/api/messages/sent', null, userToken);
  console.log('');

  // Test 8: Message Endpoints (Admin)
  console.log('8. Testing Message Endpoints (Admin):');
  await testEndpoint('GET', '/api/messages/admin/all', null, adminToken);
  console.log('');

  // Test 9: Root Endpoint
  console.log('9. Testing Root Endpoint:');
  await testEndpoint('GET', '/');
  console.log('');

  console.log('🎉 API Endpoint Tests Completed!');
}

// Run the tests
runTests().catch(console.error); 