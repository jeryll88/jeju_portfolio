const prisma = require('../config/database.js');
const cloudinaryUtils = require('../utils/cloudinaryUpload.js');

// ─── CATEGORIES ────────────────────────────────────────────────

// GET /api/skills/categories
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.skillCategory.findMany({
      orderBy: { order: 'asc' },
    });

    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
};

// POST /api/skills/categories — authenticated
const createCategory = async (req, res) => {
  try {
    const { name, order } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    // Check for duplicate name
    const existing = await prisma.skillCategory.findUnique({ where: { name } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A category with this name already exists.' });
    }

    const category = await prisma.skillCategory.create({
      data: {
        name,
        order: order !== undefined ? parseInt(order, 10) : 0,
      },
    });

    res.status(201).json({ success: true, message: 'Category created.', category });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ success: false, message: 'Failed to create category.' });
  }
};

// PUT /api/skills/categories/:id — authenticated
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, order } = req.body;

    const existing = await prisma.skillCategory.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    // Check for duplicate name if changing
    if (name && name !== existing.name) {
      const duplicate = await prisma.skillCategory.findUnique({ where: { name } });
      if (duplicate) {
        return res.status(409).json({ success: false, message: 'A category with this name already exists.' });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (order !== undefined) updateData.order = parseInt(order, 10);

    const category = await prisma.skillCategory.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({ success: true, message: 'Category updated.', category });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ success: false, message: 'Failed to update category.' });
  }
};

// DELETE /api/skills/categories/:id — authenticated
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.skillCategory.findUnique({
      where: { id },
      include: { skills: true },
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    // Delete logos from cloudinary for all skills in this category
    for (const skill of existing.skills) {
      if (skill.logoId) {
        await cloudinaryUtils.deleteFromCloudinary(skill.logoId);
      }
    }

    // Cascade delete will remove skills as well
    await prisma.skillCategory.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Category and associated skills deleted.' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete category.' });
  }
};

// ─── SKILLS ────────────────────────────────────────────────────

// GET /api/skills — public: published skills grouped by category
const getSkills = async (req, res) => {
  try {
    const categories = await prisma.skillCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        skills: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch skills.' });
  }
};

// GET /api/skills/all — admin: all skills
const getAllSkills = async (req, res) => {
  try {
    const categories = await prisma.skillCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        skills: {
          orderBy: { order: 'asc' },
        },
      },
    });

    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error('Get all skills error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch all skills.' });
  }
};

// POST /api/skills — authenticated
const createSkill = async (req, res) => {
  try {
    const { name, proficiency, order, isPublished, categoryId, description, logoUrl } = req.body;

    if (!name || !categoryId) {
      return res.status(400).json({ success: false, message: 'Name and category ID are required.' });
    }

    // Verify category exists
    const category = await prisma.skillCategory.findUnique({ where: { id: categoryId } });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const skillData = {
      name,
      description: description || '',
      categoryId,
      proficiency: proficiency || 'Intermediate',
      order: order !== undefined ? parseInt(order, 10) : 0,
      isPublished: isPublished !== undefined ? (isPublished === 'true' || isPublished === true) : true,
    };

    if (logoUrl) {
      skillData.logoUrl = logoUrl;
    }

    // Handle logo upload
    if (req.file) {
      const result = await cloudinaryUtils.uploadToCloudinary(req.file.buffer, 'portfolio/skills');
      skillData.logoUrl = result.url;
      skillData.logoId = result.publicId;
    }

    const skill = await prisma.skill.create({ data: skillData });

    res.status(201).json({ success: true, message: 'Skill created.', skill });
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ success: false, message: 'Failed to create skill.' });
  }
};

// PUT /api/skills/:id — authenticated
const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, proficiency, order, isPublished, categoryId, description, logoUrl } = req.body;

    const existing = await prisma.skill.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Skill not found.' });
    }

    // Verify category if changing
    if (categoryId) {
      const category = await prisma.skillCategory.findUnique({ where: { id: categoryId } });
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found.' });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (proficiency !== undefined) updateData.proficiency = proficiency;
    if (order !== undefined) updateData.order = parseInt(order, 10);
    if (isPublished !== undefined) updateData.isPublished = (isPublished === 'true' || isPublished === true);
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl;

    // Handle logo upload
    if (req.file) {
      // Delete old logo from cloudinary
      if (existing.logoId) {
        await cloudinaryUtils.deleteFromCloudinary(existing.logoId);
      }
      const result = await cloudinaryUtils.uploadToCloudinary(req.file.buffer, 'portfolio/skills');
      updateData.logoUrl = result.url;
      updateData.logoId = result.publicId;
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({ success: true, message: 'Skill updated.', skill });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ success: false, message: 'Failed to update skill.' });
  }
};

// DELETE /api/skills/:id — authenticated
const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.skill.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Skill not found.' });
    }

    // Delete logo from cloudinary
    if (existing.logoId) {
      await cloudinaryUtils.deleteFromCloudinary(existing.logoId);
    }

    await prisma.skill.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Skill deleted.' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete skill.' });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getSkills,
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};
