const express = require('express');
const router = express.Router();
const awardController = require('../controllers/awardController.js');
const authenticate = require('../middleware/auth.js');
const upload = require('../middleware/upload.js');

// GET /api/awards — public: published awards ordered
router.get('/', awardController.getAwards);

// GET /api/awards/all — admin: all awards
router.get('/all', authenticate, awardController.getAllAwards);

// POST /api/awards — authenticated with image upload
router.post('/', authenticate, upload.uploadSingle('image'), awardController.createAward);

// PUT /api/awards/:id — authenticated with image upload
router.put('/:id', authenticate, upload.uploadSingle('image'), awardController.updateAward);

// DELETE /api/awards/:id — authenticated (also deletes from cloudinary)
router.delete('/:id', authenticate, awardController.deleteAward);

module.exports = router;
