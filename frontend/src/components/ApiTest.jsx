import React, { useState } from 'react';
import { authApi } from '../services/api';

const ApiTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setTestResult('Testing API...');
    
    try {
      console.log('🧪 Starting API Test...');
      
      // Test admin login
      const response = await authApi.adminLogin({
        email: 'admin@gmail.com',
        password: 'admin123'
      });
      
      console.log('✅ Full API Response:', response);
      
      // Check the correct response structure
      const token = response.data?.data?.token || response.data?.token;
      const admin = response.data?.data?.admin || response.data?.admin;
      
      if (token) {
        setTestResult(`✅ API Test Successful! 
Token: ${token.substring(0, 20)}...
Admin: ${admin?.name} (${admin?.email})
Message: ${response.data?.message}`);
      } else {
        setTestResult(`⚠️ API Test Response: ${JSON.stringify(response.data, null, 2)}`);
      }
      
      console.log('✅ API Test Result:', response.data);
    } catch (error) {
      console.error('❌ API Test Error:', error);
      console.error('❌ Error Response:', error.response?.data);
      
      setTestResult(`❌ API Test Failed: ${error.response?.status} - ${error.response?.data?.message || error.message}
      
Full Error: ${JSON.stringify(error.response?.data || error.message, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">🔧 API Configuration Test</h3>
      
      <div className="mb-4 text-sm">
        <p><strong>VITE_API_URL:</strong> {import.meta.env.VITE_API_URL || 'Not set'}</p>
        <p><strong>Base URL:</strong> {import.meta.env.VITE_API_URL || '/api'}</p>
      </div>
      
      <button 
        onClick={testApi}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>
      
      {testResult && (
        <div className="mt-4 p-3 rounded bg-gray-100">
          <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest; 