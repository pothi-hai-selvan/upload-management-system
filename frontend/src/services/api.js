import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
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
    return api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getUserDocuments: () => api.get('/documents/my-documents'),

  getAllDocuments: () => api.get('/documents/admin/all-documents'),

  download: (documentId) => api.get(`/documents/download/${documentId}`, {
    responseType: 'blob',
  }),

  delete: (documentId) => api.delete(`/documents/${documentId}`),

  getDocumentsByUser: (userId, email) => {
    const data = userId ? { userId } : { email };
    return api.post('/documents/admin/user-documents', data);
  },
};

// Auth API functions
export const authApi = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  adminLogin: (credentials) => api.post('/auth/admin/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  getAdminUsers: () => api.get('/auth/admin-users'),
};

// Message API functions
export const messageApi = {
  sendMessage: (messageData) => api.post('/messages/send', messageData),
  getInbox: (params) => api.get('/messages/inbox', { params }),
  getSentMessages: (params) => api.get('/messages/sent', { params }),
  getMessage: (messageId) => api.get(`/messages/${messageId}`),
  markAsRead: (messageId) => api.patch(`/messages/${messageId}/read`),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
  getAllMessages: (params) => api.get('/messages/admin/all', { params }),
  sendBroadcast: (broadcastData) => api.post('/messages/admin/broadcast', broadcastData),
}; 