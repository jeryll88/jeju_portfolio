const prisma = require('../config/database.js');

// GET /api/settings — public
const getSettings = async (req, res) => {
  try {
    let settings = await prisma.websiteSettings.findFirst();

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.websiteSettings.create({ data: {} });
    }

    res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch settings.' });
  }
};

// PUT /api/settings — authenticated
const updateSettings = async (req, res) => {
  try {
    const { siteTitle, footerText } = req.body;

    let settings = await prisma.websiteSettings.findFirst();

    const updateData = {};
    if (siteTitle !== undefined) updateData.siteTitle = siteTitle;
    if (footerText !== undefined) updateData.footerText = footerText;

    if (settings) {
      settings = await prisma.websiteSettings.update({
        where: { id: settings.id },
        data: updateData,
      });
    } else {
      settings = await prisma.websiteSettings.create({ data: updateData });
    }

    res.status(200).json({ success: true, message: 'Settings updated.', settings });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to update settings.' });
  }
};

module.exports = { getSettings, updateSettings };
