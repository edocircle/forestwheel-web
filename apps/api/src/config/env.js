import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from monorepo root (apps/api/src/config → 4 levels up)
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
// Fallback: also try loading from apps/api/.env if it exists
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  // Server
  PORT: parseInt(process.env.API_PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  DATABASE_URL: process.env.DATABASE_URL,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-dev-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',

  // Frontend URLs (for CORS)
  WEB_URL: process.env.WEB_URL || 'http://localhost:5173',
  ADMIN_URL: process.env.ADMIN_URL || 'http://localhost:5174',
  API_URL: process.env.API_URL || 'http://localhost:3001',

  // SMTP (Gmail)
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || 'Forest Wheel <noreply@forestwheel.com>',

  // File Upload
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'E:/forestwheel-uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
};

export default env;
