const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController.js');
const authenticate = require('../middleware/auth.js');

// GET /api/education — public
router.get('/', educationController.getEducation);

// POST /api/education — authenticated
router.post('/', authenticate, educationController.createEducation);

// PUT /api/education/:id — authenticated
router.put('/:id', authenticate, educationController.updateEducation);

// DELETE /api/education/:id — authenticated
router.delete('/:id', authenticate, educationController.deleteEducation);

module.exports = router;
