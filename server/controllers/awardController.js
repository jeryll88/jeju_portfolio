const prisma = require('../config/database.js');
const cloudinaryUtils = require('../utils/cloudinaryUpload.js');

// GET /api/awards — public: published awards ordered
const getAwards = async (req, res) => {
  try {
    const awards = await prisma.award.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
    });

    res.status(200).json({ success: true, awards });
  } catch (error) {
    console.error('Get awards error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch awards.' });
  }
};

// GET /api/awards/all — admin: all awards
const getAllAwards = async (req, res) => {
  try {
    const awards = await prisma.award.findMany({
      orderBy: { order: 'asc' },
    });

    res.status(200).json({ success: true, awards });
  } catch (error) {
    console.error('Get all awards error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch all awards.' });
  }
};

// POST /api/awards — authenticated
const createAward = async (req, res) => {
  try {
    const { title, organization, dateReceived, description, verificationLink, isPublished, order } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Award title is required.' });
    }

    const awardData = {
      title,
      organization: organization || '',
      dateReceived: dateReceived || '',
      description: description || '',
      verificationLink: verificationLink || null,
      isPublished: isPublished !== undefined ? (isPublished === 'true' || isPublished === true) : true,
      order: order !== undefined ? parseInt(order, 10) : 0,
    };

    // Handle image upload
    if (req.file) {
      const result = await cloudinaryUtils.uploadToCloudinary(req.file.buffer, 'portfolio/awards');
      awardData.imageUrl = result.url;
      awardData.imageId = result.publicId;
    }

    const award = await prisma.award.create({ data: awardData });

    res.status(201).json({ success: true, message: 'Award created.', award });
  } catch (error) {
    console.error('Create award error:', error);
    res.status(500).json({ success: false, message: 'Failed to create award.' });
  }
};

// PUT /api/awards/:id — authenticated
const updateAward = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, organization, dateReceived, description, verificationLink, isPublished, order } = req.body;

    const existing = await prisma.award.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Award not found.' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (organization !== undefined) updateData.organization = organization;
    if (dateReceived !== undefined) updateData.dateReceived = dateReceived;
    if (description !== undefined) updateData.description = description;
    if (verificationLink !== undefined) updateData.verificationLink = verificationLink || null;
    if (isPublished !== undefined) updateData.isPublished = (isPublished === 'true' || isPublished === true);
    if (order !== undefined) updateData.order = parseInt(order, 10);

    // Handle image upload
    if (req.file) {
      // Delete old image from cloudinary
      if (existing.imageId) {
        await cloudinaryUtils.deleteFromCloudinary(existing.imageId);
      }
      const result = await cloudinaryUtils.uploadToCloudinary(req.file.buffer, 'portfolio/awards');
      updateData.imageUrl = result.url;
      updateData.imageId = result.publicId;
    }

    const award = await prisma.award.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({ success: true, message: 'Award updated.', award });
  } catch (error) {
    console.error('Update award error:', error);
    res.status(500).json({ success: false, message: 'Failed to update award.' });
  }
};

// DELETE /api/awards/:id — authenticated
const deleteAward = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.award.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Award not found.' });
    }

    // Delete image from cloudinary
    if (existing.imageId) {
      await cloudinaryUtils.deleteFromCloudinary(existing.imageId);
    }

    await prisma.award.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Award deleted.' });
  } catch (error) {
    console.error('Delete award error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete award.' });
  }
};

module.exports = { getAwards, getAllAwards, createAward, updateAward, deleteAward };
