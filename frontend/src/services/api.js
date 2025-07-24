import axios from 'axios';

// Determine the base URL based on environment
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Fallback for development
  return '/api';
};

// Check if we're using a full URL (production) or proxy (development)
const isFullURL = import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.startsWith('/');

// Helper function to get the correct API path
const getApiPath = (path) => {
  if (isFullURL) {
    // Remove /api prefix if it exists, then add it
    const cleanPath = path.startsWith('/api/') ? path.substring(4) : path;
    const finalPath = `/api${cleanPath}`;
    console.log(`🔗 API Path Debug: ${path} -> ${finalPath} (Production)`);
    return finalPath;
  }
  // For development proxy, use the path as is
  console.log(`🔗 API Path Debug: ${path} (Development)`);
  return path;
};

// Debug logging
console.log('🔧 API Configuration Debug:');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('isFullURL:', isFullURL);
console.log('baseURL:', getBaseURL());

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the complete URL being called
    const fullUrl = config.baseURL + config.url;
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${fullUrl}`);
    console.log(`🚀 Request Config:`, {
      baseURL: config.baseURL,
      url: config.url,
      fullUrl: fullUrl,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} - ${response.config.url}`);
    return response;
  },
  (error) => {
    console.log(`❌ API Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    console.log(`❌ Error URL: ${error.config?.baseURL}${error.config?.url}`);
    console.log(`❌ Error Details:`, error.response?.data);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Document API functions
export const documentApi = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('document', file);
    return api.post(getApiPath('/documents/upload'), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getUserDocuments: () => api.get(getApiPath('/documents/my-documents')),

  getAllDocuments: () => api.get(getApiPath('/documents/admin/all-documents')),

  download: (documentId) => api.get(getApiPath(`/documents/download/${documentId}`), {
    responseType: 'blob',
  }),

  delete: (documentId) => api.delete(getApiPath(`/documents/${documentId}`)),

  getDocumentsByUser: (userId, email) => {
    const data = userId ? { userId } : { email };
    return api.post(getApiPath('/documents/admin/user-documents'), data);
  },
};

// Auth API functions
export const authApi = {
  register: (userData) => api.post(getApiPath('/auth/register'), userData),
  login: (credentials) => api.post(getApiPath('/auth/login'), credentials),
  adminLogin: (credentials) => api.post(getApiPath('/auth/admin/login'), credentials),
  getProfile: () => api.get(getApiPath('/auth/profile')),
  getAdminUsers: () => api.get(getApiPath('/auth/admin-users')),
};

// Message API functions
export const messageApi = {
  sendMessage: (messageData) => api.post(getApiPath('/messages/send'), messageData),
  getInbox: (params) => api.get(getApiPath('/messages/inbox'), { params }),
  getSentMessages: (params) => api.get(getApiPath('/messages/sent'), { params }),
  getMessage: (messageId) => api.get(getApiPath(`/messages/${messageId}`)),
  markAsRead: (messageId) => api.patch(getApiPath(`/messages/${messageId}/read`)),
  deleteMessage: (messageId) => api.delete(getApiPath(`/messages/${messageId}`)),
  getAllMessages: (params) => api.get(getApiPath('/messages/admin/all'), { params }),
  sendBroadcast: (broadcastData) => api.post(getApiPath('/messages/admin/broadcast'), broadcastData),
}; 