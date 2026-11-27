const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const UPLOADS_ROOT = path.resolve(__dirname, '..', 'uploads');

const isCloudinaryConfigured = () => {
  const name = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!name || !key || !secret) return false;
  if (name.startsWith('your-') || key.startsWith('your-') || secret.startsWith('your-')) {
    return false;
  }
  return true;
};

const detectExtension = (buffer) => {
  if (!buffer || buffer.length < 4) return '.bin';
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return '.png';
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return '.jpg';
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) return '.gif';
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return '.webp';
  }
  if (buffer.toString('ascii', 0, 4) === '%PDF') return '.pdf';
  const head = buffer.slice(0, 256).toString('utf8').toLowerCase();
  if (head.includes('<svg')) return '.svg';
  return '.png';
};

const saveLocally = (fileBuffer, folder = 'portfolio') => {
  const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, '').replace(/^\/+|\/+$/g, '') || 'portfolio';
  const targetDir = path.resolve(UPLOADS_ROOT, safeFolder);
  if (!targetDir.startsWith(UPLOADS_ROOT)) {
    throw new Error('Invalid upload folder path');
  }
  fs.mkdirSync(targetDir, { recursive: true });

  const ext = detectExtension(fileBuffer);
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
  const fullPath = path.join(targetDir, filename);
  fs.writeFileSync(fullPath, fileBuffer);

  const relativePath = `${safeFolder}/${filename}`;
  return {
    url: `/api/uploads/${relativePath}`,
    publicId: `local:${relativePath}`,
  };
};

/**
 * Upload a file buffer to Cloudinary (or local /api/uploads fallback when Cloudinary is not configured).
 * @param {Buffer} fileBuffer - The file buffer to upload.
 * @param {string} folder - The folder for organization.
 * @returns {Promise<{ url: string, publicId: string }>}
 */
const uploadToCloudinary = (fileBuffer, folder = 'portfolio') => {
  if (!isCloudinaryConfigured()) {
    return Promise.resolve(saveLocally(fileBuffer, folder));
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          // Fall back to local storage if Cloudinary account/cloud_name is disabled
          if (error.message && error.message.toLowerCase().includes('disabled')) {
            try {
              resolve(saveLocally(fileBuffer, folder));
            } catch (localErr) {
              reject(new Error(`Upload failed: ${localErr.message}`));
            }
          } else {
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          }
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    const readableStream = new Readable();
    readableStream.push(fileBuffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

/**
 * Delete a file from Cloudinary or local storage by its public ID.
 * @param {string} publicId - The public ID or local: path of the file to delete.
 * @returns {Promise<object>}
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return { result: 'ok' };

  if (publicId.startsWith('local:')) {
    const relPath = publicId.slice('local:'.length);
    const fullPath = path.resolve(UPLOADS_ROOT, relPath);
    if (fullPath.startsWith(UPLOADS_ROOT) && fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
    return { result: 'ok' };
  }

  if (!isCloudinaryConfigured()) {
    return { result: 'skipped' };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
