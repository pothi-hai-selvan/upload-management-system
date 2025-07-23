const express = require('express');
const router = express.Router();
const { 
  sendMessage, 
  getInbox, 
  getSentMessages, 
  getMessage, 
  markAsRead, 
  deleteMessage,
  getAllMessages,
  sendBroadcast
} = require('../controllers/messageController');
const { authenticateToken, requireUser, requireAdmin } = require('../middleware/auth');

// User routes (require authentication)
router.post('/send', authenticateToken, requireUser, sendMessage);
router.get('/inbox', authenticateToken, requireUser, getInbox);
router.get('/sent', authenticateToken, requireUser, getSentMessages);
router.get('/:messageId', authenticateToken, getMessage);
router.patch('/:messageId/read', authenticateToken, requireUser, markAsRead);
router.delete('/:messageId', authenticateToken, deleteMessage);

// Admin routes (require admin authentication)
router.get('/admin/all', authenticateToken, requireAdmin, getAllMessages);
router.post('/admin/broadcast', authenticateToken, requireAdmin, sendBroadcast);

module.exports = router; 