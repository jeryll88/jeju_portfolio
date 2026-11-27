const prisma = require('../config/database.js');

// POST /api/contact — public (rate-limited)
const submitMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    const errors = [];
    if (!name || !name.trim()) errors.push('Name is required.');
    if (!email || !email.trim()) errors.push('Email is required.');
    if (!subject || !subject.trim()) errors.push('Subject is required.');
    if (!message || !message.trim()) errors.push('Message is required.');

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed.', errors });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      },
    });

    res.status(201).json({ success: true, message: 'Message sent successfully.', contactMessage });
  } catch (error) {
    console.error('Submit message error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
};

// GET /api/contact — authenticated: all messages with optional sort
const getMessages = async (req, res) => {
  try {
    const { sort } = req.query;
    const orderDirection = sort === 'asc' ? 'asc' : 'desc';

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: orderDirection },
    });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages.' });
  }
};

// GET /api/contact/:id — authenticated
const getMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.contactMessage.findUnique({ where: { id } });
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    res.status(200).json({ success: true, message: message });
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch message.' });
  }
};

// PATCH /api/contact/:id/read — authenticated: toggle read status
const toggleReadStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: !existing.isRead },
    });

    res.status(200).json({
      success: true,
      message: `Message marked as ${updated.isRead ? 'read' : 'unread'}.`,
      contactMessage: updated,
    });
  } catch (error) {
    console.error('Toggle read status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update message status.' });
  }
};

// DELETE /api/contact/:id — authenticated
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    await prisma.contactMessage.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Message deleted.' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete message.' });
  }
};

module.exports = { submitMessage, getMessages, getMessage, toggleReadStatus, deleteMessage };
