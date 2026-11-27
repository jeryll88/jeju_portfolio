const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController.js');
const authenticate = require('../middleware/auth.js');
const upload = require('../middleware/upload.js');

// ─── CATEGORY ROUTES ───────────────────────────────────────────
// GET /api/skills/categories
router.get('/categories', skillController.getCategories);

// POST /api/skills/categories — authenticated
router.post('/categories', authenticate, skillController.createCategory);

// PUT /api/skills/categories/:id — authenticated
router.put('/categories/:id', authenticate, skillController.updateCategory);

// DELETE /api/skills/categories/:id — authenticated
router.delete('/categories/:id', authenticate, skillController.deleteCategory);

// ─── SKILL ROUTES ──────────────────────────────────────────────
// GET /api/skills — public: published skills grouped by category
router.get('/', skillController.getSkills);

// GET /api/skills/all — admin: all skills
router.get('/all', authenticate, skillController.getAllSkills);

// POST /api/skills — authenticated with logo upload
router.post('/', authenticate, upload.uploadSingle('logo'), skillController.createSkill);

// PUT /api/skills/:id — authenticated with logo upload
router.put('/:id', authenticate, upload.uploadSingle('logo'), skillController.updateSkill);

// DELETE /api/skills/:id — authenticated
router.delete('/:id', authenticate, skillController.deleteSkill);

module.exports = router;
