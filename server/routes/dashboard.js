const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController.js');
const authenticate = require('../middleware/auth.js');

// GET /api/dashboard/stats — authenticated
router.get('/stats', authenticate, dashboardController.getStats);

// GET /api/dashboard/recent — authenticated
router.get('/recent', authenticate, dashboardController.getRecent);

module.exports = router;
