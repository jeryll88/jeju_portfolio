const prisma = require('../config/database.js');

// GET /api/about — public (about + education)
const getAbout = async (req, res) => {
  try {
    const about = await prisma.about.findFirst();
    const education = await prisma.education.findMany({
      orderBy: { order: 'asc' },
    });

    res.status(200).json({
      success: true,
      about: about || null,
      education,
    });
  } catch (error) {
    console.error('Get about error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch about information.' });
  }
};

// PUT /api/about — authenticated
const updateAbout = async (req, res) => {
  try {
    const { biography, interests, careerGoals } = req.body;

    let about = await prisma.about.findFirst();

    const updateData = {};
    if (biography !== undefined) updateData.biography = biography;
    if (interests !== undefined) updateData.interests = interests;
    if (careerGoals !== undefined) updateData.careerGoals = careerGoals;

    if (about) {
      about = await prisma.about.update({
        where: { id: about.id },
        data: updateData,
      });
    } else {
      about = await prisma.about.create({ data: updateData });
    }

    res.status(200).json({ success: true, message: 'About section updated.', about });
  } catch (error) {
    console.error('Update about error:', error);
    res.status(500).json({ success: false, message: 'Failed to update about section.' });
  }
};

module.exports = { getAbout, updateAbout };
