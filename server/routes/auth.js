const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const authenticate = require('../middleware/auth.js');
const rateLimit = require('../middleware/rateLimiter.js');

// POST /api/auth/login
router.post('/login', rateLimit.loginLimiter, authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

// GET /api/auth/me
router.get('/me', authenticate, authController.getMe);

module.exports = router;
