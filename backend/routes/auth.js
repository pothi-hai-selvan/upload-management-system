const express = require('express');
const router = express.Router();
const { registerUser, loginUser, loginAdmin, getProfile, getAdminUsers } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin/login', loginAdmin);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.get('/admin-users', authenticateToken, getAdminUsers);

module.exports = router; 