import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import env from '../config/env.js';
import { uploadToCloudinary, deleteFromCloudinary } from './cloudinaryService.js';

const prisma = new PrismaClient();

/**
 * List vehicles with pagination and filters
 */
export async function listVehicles({
  page = 1,
  limit = 10,
  status = null,
  make = null,
  model = null,
  featured = null,
  search = '',
  sortBy = 'createdAt',
  sortOrder = 'desc',
}) {
  const skip = (page - 1) * limit;
  const where = {};

  if (status) where.status = status;
  if (make) where.make = { contains: make, mode: 'insensitive' };
  if (model) where.model = { contains: model, mode: 'insensitive' };
  if (featured !== null) where.featured = featured === 'true' || featured === true;

  if (search) {
    where.OR = [
      { make: { contains: search, mode: 'insensitive' } },
      { model: { contains: search, mode: 'insensitive' } },
      { variant: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        createdBy: {
          select: { id: true, fullName: true },
        },
      },
    }),
    prisma.vehicle.count({ where }),
  ]);

  return { vehicles, total, page, limit };
}

/**
 * Get vehicle by ID
 */
export async function getVehicleById(id) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      createdBy: { select: { id: true, fullName: true } },
    },
  });

  if (!vehicle) throw new Error('Vehicle not found');
  return vehicle;
}

/**
 * Create vehicle
 */
export async function createVehicle(data, userId) {
  const vehicle = await prisma.vehicle.create({
    data: {
      ...data,
      createdById: userId,
    },
    include: {
      images: true,
    },
  });

  // Log activity
  await prisma.activityLog.create({
    data: {
      userId,
      action: 'CREATE',
      entityType: 'vehicle',
      entityId: vehicle.id,
      metadata: { make: data.make, model: data.model },
    },
  });

  return vehicle;
}

/**
 * Update vehicle
 */
export async function updateVehicle(id, data, userId) {
  const vehicle = await prisma.vehicle.update({
    where: { id },
    data,
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
    },
  });

  await prisma.activityLog.create({
    data: {
      userId,
      action: 'UPDATE',
      entityType: 'vehicle',
      entityId: id,
      metadata: data,
    },
  });

  return vehicle;
}

/**
 * Delete vehicle and its images
 */
export async function deleteVehicle(id, userId) {
  // Get images to delete files
  const images = await prisma.vehicleImage.findMany({
    where: { vehicleId: id },
  });

  // Delete files (cloud or local)
  for (const img of images) {
    if (img.url.startsWith('http')) {
      // Cloud image (Cloudinary)
      await deleteFromCloudinary(img.url);
    } else {
      const filePath = path.join(env.UPLOAD_DIR, img.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

  await prisma.vehicle.delete({ where: { id } });

  await prisma.activityLog.create({
    data: {
      userId,
      action: 'DELETE',
      entityType: 'vehicle',
      entityId: id,
    },
  });
}

/**
 * Add images to a vehicle
 */
export async function addVehicleImages(vehicleId, files) {
  const existingCount = await prisma.vehicleImage.count({
    where: { vehicleId },
  });

  const imagesData = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let fileUrl = '';
    
    if (env.CLOUDINARY_CLOUD_NAME && file.buffer) {
      // Upload to Cloudinary
      fileUrl = await uploadToCloudinary(file.buffer, file.originalname);
    } else {
      // Local storage
      fileUrl = `vehicles/${file.filename}`;
    }

    imagesData.push({
      vehicleId,
      url: fileUrl,
      altText: file.originalname,
      sortOrder: existingCount + i,
      isPrimary: existingCount === 0 && i === 0,
    });
  }

  await prisma.vehicleImage.createMany({ data: imagesData });

  return prisma.vehicleImage.findMany({
    where: { vehicleId },
    orderBy: { sortOrder: 'asc' },
  });
}

/**
 * Delete a vehicle image
 */
export async function deleteVehicleImage(vehicleId, imageId) {
  const image = await prisma.vehicleImage.findFirst({
    where: { id: imageId, vehicleId },
  });

  if (!image) throw new Error('Image not found');

  if (image.url.startsWith('http')) {
    await deleteFromCloudinary(image.url);
  } else {
    const filePath = path.join(env.UPLOAD_DIR, image.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await prisma.vehicleImage.delete({ where: { id: imageId } });
}
