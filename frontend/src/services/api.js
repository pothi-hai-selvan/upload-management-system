import axios from 'axios';

// Determine the base URL based on environment
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Fallback for development
  return '/api';
};

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
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
    return api.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getUserDocuments: () => api.get('/api/documents/my-documents'),

  getAllDocuments: () => api.get('/api/documents/admin/all-documents'),

  download: (documentId) => api.get(`/api/documents/download/${documentId}`, {
    responseType: 'blob',
  }),

  delete: (documentId) => api.delete(`/api/documents/${documentId}`),

  getDocumentsByUser: (userId, email) => {
    const data = userId ? { userId } : { email };
    return api.post('/api/documents/admin/user-documents', data);
  },
};

// Auth API functions
export const authApi = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  adminLogin: (credentials) => api.post('/api/auth/admin/login', credentials),
  getProfile: () => api.get('/api/auth/profile'),
  getAdminUsers: () => api.get('/api/auth/admin-users'),
};

// Message API functions
export const messageApi = {
  sendMessage: (messageData) => api.post('/api/messages/send', messageData),
  getInbox: (params) => api.get('/api/messages/inbox', { params }),
  getSentMessages: (params) => api.get('/api/messages/sent', { params }),
  getMessage: (messageId) => api.get(`/api/messages/${messageId}`),
  markAsRead: (messageId) => api.patch(`/api/messages/${messageId}/read`),
  deleteMessage: (messageId) => api.delete(`/api/messages/${messageId}`),
  getAllMessages: (params) => api.get('/api/messages/admin/all', { params }),
  sendBroadcast: (broadcastData) => api.post('/api/messages/admin/broadcast', broadcastData),
}; 