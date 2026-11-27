const prisma = require('../config/database.js');
const cloudinaryUtils = require('../utils/cloudinaryUpload.js');

// GET /api/profile — public
const getProfile = async (req, res) => {
  try {
    const profile = await prisma.profile.findFirst();
    const socialLinks = await prisma.socialLink.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' },
    });

    res.status(200).json({
      success: true,
      profile: profile || null,
      socialLinks,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile.' });
  }
};

// PUT /api/profile — authenticated
const updateProfile = async (req, res) => {
  try {
    const { fullName, professionalTitle, introduction, tagline, email } = req.body;

    // Check if a profile exists
    let profile = await prisma.profile.findFirst();

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (professionalTitle !== undefined) updateData.professionalTitle = professionalTitle;
    if (introduction !== undefined) updateData.introduction = introduction;
    if (tagline !== undefined) updateData.tagline = tagline;
    if (email !== undefined) updateData.email = email;

    // Handle profile image upload
    if (req.file) {
      // Delete old image from cloudinary if it exists
      if (profile && profile.profileImageId) {
        await cloudinaryUtils.deleteFromCloudinary(profile.profileImageId);
      }

      const result = await cloudinaryUtils.uploadToCloudinary(req.file.buffer, 'portfolio/profile');
      updateData.profileImageUrl = result.url;
      updateData.profileImageId = result.publicId;
    }

    if (profile) {
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: updateData,
      });
    } else {
      profile = await prisma.profile.create({ data: updateData });
    }

    res.status(200).json({ success: true, message: 'Profile updated successfully.', profile });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

// POST /api/profile/resume — authenticated
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No resume file provided.' });
    }

    let profile = await prisma.profile.findFirst();

    // Delete old resume from cloudinary if it exists
    if (profile && profile.resumeId) {
      await cloudinaryUtils.deleteFromCloudinary(profile.resumeId);
    }

    const result = await cloudinaryUtils.uploadToCloudinary(req.file.buffer, 'portfolio/resumes');

    const updateData = {
      resumeUrl: result.url,
      resumeId: result.publicId,
    };

    if (profile) {
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: updateData,
      });
    } else {
      profile = await prisma.profile.create({ data: updateData });
    }

    res.status(200).json({ success: true, message: 'Resume uploaded successfully.', profile });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload resume.' });
  }
};

// DELETE /api/profile/resume — authenticated
const deleteResume = async (req, res) => {
  try {
    const profile = await prisma.profile.findFirst();

    if (!profile || !profile.resumeUrl) {
      return res.status(404).json({ success: false, message: 'No resume found to delete.' });
    }

    // Delete from cloudinary
    if (profile.resumeId) {
      await cloudinaryUtils.deleteFromCloudinary(profile.resumeId);
    }

    await prisma.profile.update({
      where: { id: profile.id },
      data: { resumeUrl: null, resumeId: null },
    });

    res.status(200).json({ success: true, message: 'Resume deleted successfully.' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete resume.' });
  }
};

module.exports = { getProfile, updateProfile, uploadResume, deleteResume };
