const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController.js');
const authenticate = require('../middleware/auth.js');
const rateLimit = require('../middleware/rateLimiter.js');

// POST /api/contact — public (rate-limited): submit message
router.post('/', rateLimit.contactLimiter, contactController.submitMessage);

// GET /api/contact — authenticated: get all messages (supports ?sort=asc|desc)
router.get('/', authenticate, contactController.getMessages);

// GET /api/contact/:id — authenticated: get single message
router.get('/:id', authenticate, contactController.getMessage);

// PATCH /api/contact/:id/read — authenticated: toggle read status
router.patch('/:id/read', authenticate, contactController.toggleReadStatus);

// DELETE /api/contact/:id — authenticated: delete message
router.delete('/:id', authenticate, contactController.deleteMessage);

module.exports = router;
