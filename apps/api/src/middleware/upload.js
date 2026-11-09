import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import env from '../config/env.js';

// Ensure upload directories exist
const vehicleDir = path.join(env.UPLOAD_DIR, 'vehicles');
const logoDir = path.join(env.UPLOAD_DIR, 'logos');
const generalDir = path.join(env.UPLOAD_DIR, 'general');

[vehicleDir, logoDir, generalDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Allowed image MIME types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function fileFilter(req, file, cb) {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'), false);
  }
}

// Vehicle image storage
const vehicleStorage = env.CLOUDINARY_CLOUD_NAME ? multer.memoryStorage() : multer.diskStorage({
  destination: (req, file, cb) => cb(null, vehicleDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `vehicle-${uuidv4()}${ext}`);
  },
});

// Logo storage
const logoStorage = env.CLOUDINARY_CLOUD_NAME ? multer.memoryStorage() : multer.diskStorage({
  destination: (req, file, cb) => cb(null, logoDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `logo-${Date.now()}${ext}`);
  },
});

export const uploadVehicleImages = multer({
  storage: vehicleStorage,
  fileFilter,
  limits: { fileSize: env.MAX_FILE_SIZE },
}).array('images', 10);

export const uploadLogo = multer({
  storage: logoStorage,
  fileFilter,
  limits: { fileSize: env.MAX_FILE_SIZE },
}).single('logo');

/**
 * Multer error handler
 */
export function handleUploadError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Max 10MB allowed.' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
}
