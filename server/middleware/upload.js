const multer = require('multer');
const path = require('path');

// Memory storage — files stay in memory as buffers (for Cloudinary upload)
const storage = multer.memoryStorage();

// File filter — allow only image types
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'];
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
  ];

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(mime)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only JPG, JPEG, PNG, WEBP, SVG, and GIF files are allowed.'
      ),
      false
    );
  }
};

// Multer instance with 5 MB limit
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

// Export middleware functions
const uploadSingle = (fieldName = 'image') => upload.single(fieldName);
const uploadArray = (fieldName = 'images', maxCount = 10) =>
  upload.array(fieldName, maxCount);

module.exports = { uploadSingle, uploadArray };
