const express = require('express');
const router = express.Router();
const { 
  uploadDocument, 
  getUserDocuments, 
  getDocumentsByUser, 
  getAllDocuments,
  downloadDocument, 
  deleteDocument 
} = require('../controllers/documentController');
const { authenticateToken, requireUser, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// User routes (require authentication)
router.post('/upload', authenticateToken, requireUser, upload.single('document'), uploadDocument);
router.get('/my-documents', authenticateToken, requireUser, getUserDocuments);
router.get('/download/:documentId', authenticateToken, downloadDocument);
router.delete('/:documentId', authenticateToken, deleteDocument);

// Admin routes (require admin authentication)
router.get('/admin/all-documents', authenticateToken, requireAdmin, getAllDocuments);
router.post('/admin/user-documents', authenticateToken, requireAdmin, getDocumentsByUser);

module.exports = router; 