const prisma = require('../config/database.js');

// GET /api/social-links — public (visible only)
const getSocialLinks = async (req, res) => {
  try {
    const socialLinks = await prisma.socialLink.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' },
    });

    res.status(200).json({ success: true, socialLinks });
  } catch (error) {
    console.error('Get social links error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch social links.' });
  }
};

// POST /api/social-links — authenticated
const createSocialLink = async (req, res) => {
  try {
    const { platform, url, icon, order, isVisible } = req.body;

    if (!platform || !url) {
      return res.status(400).json({ success: false, message: 'Platform and URL are required.' });
    }

    const socialLink = await prisma.socialLink.create({
      data: {
        platform,
        url,
        icon: icon || '',
        order: order !== undefined ? parseInt(order, 10) : 0,
        isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
      },
    });

    res.status(201).json({ success: true, message: 'Social link created.', socialLink });
  } catch (error) {
    console.error('Create social link error:', error);
    res.status(500).json({ success: false, message: 'Failed to create social link.' });
  }
};

// PUT /api/social-links/:id — authenticated
const updateSocialLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { platform, url, icon, order, isVisible } = req.body;

    const existing = await prisma.socialLink.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Social link not found.' });
    }

    const updateData = {};
    if (platform !== undefined) updateData.platform = platform;
    if (url !== undefined) updateData.url = url;
    if (icon !== undefined) updateData.icon = icon;
    if (order !== undefined) updateData.order = parseInt(order, 10);
    if (isVisible !== undefined) updateData.isVisible = Boolean(isVisible);

    const socialLink = await prisma.socialLink.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({ success: true, message: 'Social link updated.', socialLink });
  } catch (error) {
    console.error('Update social link error:', error);
    res.status(500).json({ success: false, message: 'Failed to update social link.' });
  }
};

// DELETE /api/social-links/:id — authenticated
const deleteSocialLink = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.socialLink.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Social link not found.' });
    }

    await prisma.socialLink.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Social link deleted.' });
  } catch (error) {
    console.error('Delete social link error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete social link.' });
  }
};

module.exports = { getSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink };
