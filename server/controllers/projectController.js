const prisma = require('../config/database.js');
const cloudinaryUtils = require('../utils/cloudinaryUpload.js');

// GET /api/projects — public: published projects with search, category & technology filters
const getProjects = async (req, res) => {
  try {
    const { search, category, technology } = req.query;

    const where = { isPublished: true };

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }
    if (category) {
      where.category = category;
    }
    if (technology) {
      where.technologies = { contains: technology, mode: 'insensitive' };
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
      include: { images: { orderBy: { order: 'asc' } } },
    });

    res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch projects.' });
  }
};

// GET /api/projects/all — admin: all projects with images
const getAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: { images: { orderBy: { order: 'asc' } } },
    });

    res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch all projects.' });
  }
};

// GET /api/projects/:id — public: single published project
const getProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: { images: { orderBy: { order: 'asc' } } },
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    if (!project.isPublished) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch project.' });
  }
};

// POST /api/projects — authenticated
const createProject = async (req, res) => {
  try {
    const {
      title, shortDesc, fullDesc, objectives, features,
      category, technologies, role, githubUrl, liveDemoUrl,
      status, isFeatured, isPublished, order,
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Project title is required.' });
    }

    const projectData = {
      title,
      shortDesc: shortDesc || '',
      fullDesc: fullDesc || '',
      objectives: objectives || '',
      features: features || '',
      category: category || 'Web Development',
      technologies: technologies || '',
      role: role || '',
      githubUrl: githubUrl || null,
      liveDemoUrl: liveDemoUrl || null,
      status: status || 'In Progress',
      isFeatured: isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : false,
      isPublished: isPublished !== undefined ? (isPublished === 'true' || isPublished === true) : true,
      order: order !== undefined ? parseInt(order, 10) : 0,
    };

    // Handle thumbnail upload
    if (req.file) {
      const result = await cloudinaryUtils.uploadToCloudinary(req.file.buffer, 'portfolio/projects');
      projectData.thumbnailUrl = result.url;
      projectData.thumbnailId = result.publicId;
    }

    const project = await prisma.project.create({
      data: projectData,
      include: { images: true },
    });

    res.status(201).json({ success: true, message: 'Project created.', project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, message: 'Failed to create project.' });
  }
};

// PUT /api/projects/:id — authenticated
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, shortDesc, fullDesc, objectives, features,
      category, technologies, role, githubUrl, liveDemoUrl,
      status, isFeatured, isPublished, order,
    } = req.body;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (shortDesc !== undefined) updateData.shortDesc = shortDesc;
    if (fullDesc !== undefined) updateData.fullDesc = fullDesc;
    if (objectives !== undefined) updateData.objectives = objectives;
    if (features !== undefined) updateData.features = features;
    if (category !== undefined) updateData.category = category;
    if (technologies !== undefined) updateData.technologies = technologies;
    if (role !== undefined) updateData.role = role;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl || null;
    if (liveDemoUrl !== undefined) updateData.liveDemoUrl = liveDemoUrl || null;
    if (status !== undefined) updateData.status = status;
    if (isFeatured !== undefined) updateData.isFeatured = (isFeatured === 'true' || isFeatured === true);
    if (isPublished !== undefined) updateData.isPublished = (isPublished === 'true' || isPublished === true);
    if (order !== undefined) updateData.order = parseInt(order, 10);

    // Handle thumbnail upload
    if (req.file) {
      // Delete old thumbnail from cloudinary
      if (existing.thumbnailId) {
        await cloudinaryUtils.deleteFromCloudinary(existing.thumbnailId);
      }
      const result = await cloudinaryUtils.uploadToCloudinary(req.file.buffer, 'portfolio/projects');
      updateData.thumbnailUrl = result.url;
      updateData.thumbnailId = result.publicId;
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: { images: { orderBy: { order: 'asc' } } },
    });

    res.status(200).json({ success: true, message: 'Project updated.', project });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, message: 'Failed to update project.' });
  }
};

// DELETE /api/projects/:id — authenticated
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.project.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    // Delete thumbnail from cloudinary
    if (existing.thumbnailId) {
      await cloudinaryUtils.deleteFromCloudinary(existing.thumbnailId);
    }

    // Delete all project images from cloudinary
    for (const image of existing.images) {
      if (image.imageId) {
        await cloudinaryUtils.deleteFromCloudinary(image.imageId);
      }
    }

    // Cascade delete will remove images as well
    await prisma.project.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Project and associated images deleted.' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete project.' });
  }
};

// POST /api/projects/:id/images — authenticated: upload screenshots
const uploadProjectImages = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files provided.' });
    }

    const uploadedImages = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const result = await cloudinaryUtils.uploadToCloudinary(file.buffer, 'portfolio/projects/screenshots');

      const image = await prisma.projectImage.create({
        data: {
          imageUrl: result.url,
          imageId: result.publicId,
          caption: '',
          order: i,
          projectId: id,
        },
      });

      uploadedImages.push(image);
    }

    res.status(201).json({
      success: true,
      message: `${uploadedImages.length} image(s) uploaded.`,
      images: uploadedImages,
    });
  } catch (error) {
    console.error('Upload project images error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload project images.' });
  }
};

// DELETE /api/projects/:id/images/:imageId — authenticated
const deleteProjectImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;

    const image = await prisma.projectImage.findFirst({
      where: { id: imageId, projectId: id },
    });

    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found.' });
    }

    // Delete from cloudinary
    if (image.imageId) {
      await cloudinaryUtils.deleteFromCloudinary(image.imageId);
    }

    await prisma.projectImage.delete({ where: { id: imageId } });

    res.status(200).json({ success: true, message: 'Image deleted.' });
  } catch (error) {
    console.error('Delete project image error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete project image.' });
  }
};

module.exports = {
  getProjects,
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImages,
  deleteProjectImage,
};
