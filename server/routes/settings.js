const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController.js');
const authenticate = require('../middleware/auth.js');

// GET /api/settings — public
router.get('/', settingsController.getSettings);

// PUT /api/settings — authenticated
router.put('/', authenticate, settingsController.updateSettings);

module.exports = router;
