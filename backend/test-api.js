const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let userToken = '';
let adminToken = '';

// Test configuration
const testConfig = {
  user: {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'testpass123'
  },
  admin: {
    email: 'admin@example.com',
    password: 'admin123'
  }
};

// Helper function to make authenticated requests
const makeAuthRequest = (method, url, data = null, token = null) => {
  const config = {
    method,
    url: `${BASE_URL}${url}`,
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

  return axios(config);
};

// Test functions
const testUserRegistration = async () => {
  console.log('\n1. Testing User Registration...');
  try {
    const response = await makeAuthRequest('POST', '/auth/register', testConfig.user);
    console.log('✅ User registration successful');
    console.log('Response:', response.data);
    return response.data.data.token;
  } catch (error) {
    if (error.response?.data?.message === 'User with this email already exists') {
      console.log('⚠️  User already exists, proceeding with login...');
      return await testUserLogin();
    }
    console.log('❌ User registration failed:', error.response?.data || error.message);
    return null;
  }
};

const testUserLogin = async () => {
  console.log('\n2. Testing User Login...');
  try {
    const response = await makeAuthRequest('POST', '/auth/login', {
      email: testConfig.user.email,
      password: testConfig.user.password
    });
    console.log('✅ User login successful');
    console.log('Response:', response.data);
    return response.data.data.token;
  } catch (error) {
    console.log('❌ User login failed:', error.response?.data || error.message);
    return null;
  }
};

const testAdminLogin = async () => {
  console.log('\n3. Testing Admin Login...');
  try {
    const response = await makeAuthRequest('POST', '/auth/admin/login', testConfig.admin);
    console.log('✅ Admin login successful');
    console.log('Response:', response.data);
    return response.data.data.token;
  } catch (error) {
    console.log('❌ Admin login failed:', error.response?.data || error.message);
    return null;
  }
};

const testGetProfile = async (token) => {
  console.log('\n4. Testing Get Profile...');
  try {
    const response = await makeAuthRequest('GET', '/auth/profile', null, token);
    console.log('✅ Get profile successful');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Get profile failed:', error.response?.data || error.message);
  }
};

const testGetUserDocuments = async (token) => {
  console.log('\n5. Testing Get User Documents...');
  try {
    const response = await makeAuthRequest('GET', '/documents/my-documents', null, token);
    console.log('✅ Get user documents successful');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Get user documents failed:', error.response?.data || error.message);
  }
};

const testAdminGetUserDocuments = async (adminToken) => {
  console.log('\n6. Testing Admin Get User Documents...');
  try {
    const response = await makeAuthRequest('POST', '/documents/admin/user-documents', {
      email: testConfig.user.email
    }, adminToken);
    console.log('✅ Admin get user documents successful');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Admin get user documents failed:', error.response?.data || error.message);
  }
};

const testHealthCheck = async () => {
  console.log('\n0. Testing Health Check...');
  try {
    const response = await axios.get('http://localhost:3000/health');
    console.log('✅ Health check successful');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.response?.data || error.message);
  }
};

// Main test function
const runTests = async () => {
  console.log('🚀 Starting API Tests...\n');
  
  // Test health check first
  await testHealthCheck();
  
  // Test user authentication
  userToken = await testUserRegistration();
  if (!userToken) {
    userToken = await testUserLogin();
  }
  
  // Test admin authentication
  adminToken = await testAdminLogin();
  
  if (userToken) {
    await testGetProfile(userToken);
    await testGetUserDocuments(userToken);
  }
  
  if (adminToken) {
    await testAdminGetUserDocuments(adminToken);
  }
  
  console.log('\n🎉 API Tests completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Use the tokens above to test file uploads');
  console.log('2. Test file uploads using tools like Postman or curl');
  console.log('3. Check the database using SQL Workbench');
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testUserRegistration,
  testUserLogin,
  testAdminLogin,
  testGetProfile,
  testGetUserDocuments,
  testAdminGetUserDocuments,
  testHealthCheck
}; 