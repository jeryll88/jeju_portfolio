const prisma = require('../config/database.js');

// GET /api/education — public
const getEducation = async (req, res) => {
  try {
    const education = await prisma.education.findMany({
      orderBy: { order: 'asc' },
    });

    res.status(200).json({ success: true, education });
  } catch (error) {
    console.error('Get education error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch education records.' });
  }
};

// POST /api/education — authenticated
const createEducation = async (req, res) => {
  try {
    const { institution, degree, field, startYear, endYear, description, isCurrent, order } = req.body;

    if (!institution || !degree || !startYear) {
      return res.status(400).json({
        success: false,
        message: 'Institution, degree, and start year are required.',
      });
    }

    const education = await prisma.education.create({
      data: {
        institution,
        degree,
        field: field || '',
        startYear,
        endYear: endYear || null,
        description: description || '',
        isCurrent: isCurrent !== undefined ? Boolean(isCurrent) : false,
        order: order !== undefined ? parseInt(order, 10) : 0,
      },
    });

    res.status(201).json({ success: true, message: 'Education record created.', education });
  } catch (error) {
    console.error('Create education error:', error);
    res.status(500).json({ success: false, message: 'Failed to create education record.' });
  }
};

// PUT /api/education/:id — authenticated
const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const { institution, degree, field, startYear, endYear, description, isCurrent, order } = req.body;

    const existing = await prisma.education.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Education record not found.' });
    }

    const updateData = {};
    if (institution !== undefined) updateData.institution = institution;
    if (degree !== undefined) updateData.degree = degree;
    if (field !== undefined) updateData.field = field;
    if (startYear !== undefined) updateData.startYear = startYear;
    if (endYear !== undefined) updateData.endYear = endYear;
    if (description !== undefined) updateData.description = description;
    if (isCurrent !== undefined) updateData.isCurrent = Boolean(isCurrent);
    if (order !== undefined) updateData.order = parseInt(order, 10);

    const education = await prisma.education.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({ success: true, message: 'Education record updated.', education });
  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({ success: false, message: 'Failed to update education record.' });
  }
};

// DELETE /api/education/:id — authenticated
const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.education.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Education record not found.' });
    }

    await prisma.education.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Education record deleted.' });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete education record.' });
  }
};

module.exports = { getEducation, createEducation, updateEducation, deleteEducation };
