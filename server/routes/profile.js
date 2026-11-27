const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController.js');
const authenticate = require('../middleware/auth.js');
const upload = require('../middleware/upload.js');

// GET /api/profile — public
router.get('/', profileController.getProfile);

// PUT /api/profile — authenticated with profile image upload
router.put('/', authenticate, upload.uploadSingle('profileImage'), profileController.updateProfile);

// POST /api/profile/resume — authenticated with resume upload
router.post('/resume', authenticate, upload.uploadSingle('resume'), profileController.uploadResume);

// DELETE /api/profile/resume — authenticated
router.delete('/resume', authenticate, profileController.deleteResume);

module.exports = router;
