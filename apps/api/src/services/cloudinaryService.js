import { v2 as cloudinary } from 'cloudinary';
import env from '../config/env.js';

let configured = false;

function ensureConfigured() {
  if (configured) return;

  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials are not set in environment variables');
  }

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  configured = true;
}

/**
 * Upload an image buffer to Cloudinary
 * Returns the secure URL of the uploaded image
 */
export async function uploadToCloudinary(fileBuffer, originalName) {
  ensureConfigured();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'forestwheel/vehicles',
        public_id: `vehicle-${Date.now()}-${originalName.replace(/\.[^/.]+$/, '')}`,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return reject(new Error('Failed to upload image to Cloudinary'));
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Delete an image from Cloudinary by its public_id
 * Extracts the public_id from a full Cloudinary URL
 */
export async function deleteFromCloudinary(imageUrl) {
  ensureConfigured();

  try {
    // Extract public_id from a Cloudinary URL
    // e.g. https://res.cloudinary.com/cloud/image/upload/v123/forestwheel/vehicles/vehicle-123-name.jpg
    const urlParts = imageUrl.split('/upload/');
    if (urlParts.length < 2) return;

    // Remove version prefix (v123/) and file extension
    let publicId = urlParts[1].replace(/^v\d+\//, '');
    publicId = publicId.replace(/\.[^/.]+$/, '');

    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary Delete Error:', err);
    // Do not throw, just log so we don't block DB deletion
  }
}
