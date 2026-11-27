const express = require('express');
const router = express.Router();
const socialLinkController = require('../controllers/socialLinkController.js');
const authenticate = require('../middleware/auth.js');

// GET /api/social-links — public (visible only)
router.get('/', socialLinkController.getSocialLinks);

// POST /api/social-links — authenticated
router.post('/', authenticate, socialLinkController.createSocialLink);

// PUT /api/social-links/:id — authenticated
router.put('/:id', authenticate, socialLinkController.updateSocialLink);

// DELETE /api/social-links/:id — authenticated
router.delete('/:id', authenticate, socialLinkController.deleteSocialLink);

module.exports = router;
