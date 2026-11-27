const prisma = require('../config/database.js');

// GET /api/dashboard/stats — authenticated
const getStats = async (req, res) => {
  try {
    const [totalProjects, totalSkills, totalAwards, totalMessages, unreadMessages] = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.award.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalProjects,
        totalSkills,
        totalAwards,
        totalMessages,
        unreadMessages,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats.' });
  }
};

// GET /api/dashboard/recent — authenticated
const getRecent = async (req, res) => {
  try {
    const [recentProjects, recentMessages] = await Promise.all([
      prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { images: { orderBy: { order: 'asc' } } },
      }),
      prisma.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    res.status(200).json({
      success: true,
      recentProjects,
      recentMessages,
    });
  } catch (error) {
    console.error('Get recent error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch recent data.' });
  }
};

module.exports = { getStats, getRecent };
