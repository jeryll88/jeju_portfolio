const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController.js');
const authenticate = require('../middleware/auth.js');

// GET /api/about — public (about + education)
router.get('/', aboutController.getAbout);

// PUT /api/about — authenticated
router.put('/', authenticate, aboutController.updateAbout);

module.exports = router;
