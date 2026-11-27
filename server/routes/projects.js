const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController.js');
const authenticate = require('../middleware/auth.js');
const upload = require('../middleware/upload.js');

// GET /api/projects — public: published projects (supports ?search, ?category, ?technology)
router.get('/', projectController.getProjects);

// GET /api/projects/all — admin: all projects with images
router.get('/all', authenticate, projectController.getAllProjects);

// GET /api/projects/:id — public: single published project with images
router.get('/:id', projectController.getProject);

// POST /api/projects — authenticated with thumbnail upload
router.post('/', authenticate, upload.uploadSingle('thumbnail'), projectController.createProject);

// PUT /api/projects/:id — authenticated with thumbnail upload
router.put('/:id', authenticate, upload.uploadSingle('thumbnail'), projectController.updateProject);

// DELETE /api/projects/:id — authenticated (also deletes images from cloudinary)
router.delete('/:id', authenticate, projectController.deleteProject);

// POST /api/projects/:id/images — authenticated: upload screenshots (max 10)
router.post('/:id/images', authenticate, upload.uploadArray('images', 10), projectController.uploadProjectImages);

// DELETE /api/projects/:id/images/:imageId — authenticated: delete screenshot
router.delete('/:id/images/:imageId', authenticate, projectController.deleteProjectImage);

module.exports = router;
