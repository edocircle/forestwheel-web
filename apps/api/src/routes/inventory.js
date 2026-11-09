import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadVehicleImages, handleUploadError } from '../middleware/upload.js';
import * as inventoryService from '../services/inventoryService.js';
import env from '../config/env.js';

const router = Router();

// ── List Vehicles (Public) ─────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { page, limit, status, make, model, featured, search, sortBy, sortOrder } = req.query;
    const result = await inventoryService.listVehicles({
      page: parseInt(page || '1', 10),
      limit: parseInt(limit || '10', 10),
      status: status || null,
      make: make || null,
      model: model || null,
      featured: featured || null,
      search: search || '',
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc',
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get Vehicle Detail (Public) ────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await inventoryService.getVehicleById(req.params.id);
    res.json(vehicle);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// ── Create Vehicle (Admin) ─────────────────────────────
const createVehicleSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  variant: z.string().optional(),
  year: z.number().int().min(1900).max(2100),
  mileage: z.number().int().min(0).default(0),
  mileageUnit: z.enum(['KM', 'MI']).default('KM'),
  price: z.number().positive(),
  currency: z.string().default('SGD'),
  status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD']).default('AVAILABLE'),
  chassisNumber: z.string().optional(),
  engine: z.string().optional(),
  transmission: z.string().optional(),
  horsepower: z.string().optional(),
  torque: z.string().optional(),
  driveType: z.string().optional(),
  fuelEconomy: z.string().optional(),
  driverAssist: z.string().optional(),
  infotainment: z.string().optional(),
  soundSystem: z.string().optional(),
  connectivity: z.string().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  editorialBy: z.string().optional(),
  youtubeUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().default(false),
  inquiriesEnabled: z.boolean().default(true),
  fuelType: z.string().optional().nullable(),
  owners: z.number().int().min(0).optional().nullable(),
  registrationDate: z.coerce.date().optional().nullable(),
  coeExpiry: z.coerce.date().optional().nullable(),
});

router.post(
  '/',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN'),
  validate(createVehicleSchema),
  async (req, res) => {
    try {
      const vehicle = await inventoryService.createVehicle(req.validatedBody, req.user.id);
      res.status(201).json(vehicle);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// ── Update Vehicle (Admin) ─────────────────────────────
const updateVehicleSchema = z.object({
  make: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  variant: z.string().optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  mileage: z.number().int().min(0).optional(),
  mileageUnit: z.enum(['KM', 'MI']).optional(),
  price: z.number().positive().optional(),
  currency: z.string().optional(),
  status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD']).optional(),
  chassisNumber: z.string().optional(),
  engine: z.string().optional(),
  transmission: z.string().optional(),
  horsepower: z.string().optional(),
  torque: z.string().optional(),
  driveType: z.string().optional(),
  fuelEconomy: z.string().optional(),
  driverAssist: z.string().optional(),
  infotainment: z.string().optional(),
  soundSystem: z.string().optional(),
  connectivity: z.string().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  editorialBy: z.string().optional(),
  youtubeUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().optional(),
  inquiriesEnabled: z.boolean().optional(),
  fuelType: z.string().optional().nullable(),
  owners: z.number().int().min(0).optional().nullable(),
  registrationDate: z.coerce.date().optional().nullable(),
  coeExpiry: z.coerce.date().optional().nullable(),
});

router.put(
  '/:id',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN'),
  validate(updateVehicleSchema),
  async (req, res) => {
    try {
      const vehicle = await inventoryService.updateVehicle(
        req.params.id,
        req.validatedBody,
        req.user.id
      );
      res.json(vehicle);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// ── Delete Vehicle (Admin) ─────────────────────────────
router.delete(
  '/:id',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      await inventoryService.deleteVehicle(req.params.id, req.user.id);
      res.json({ message: 'Vehicle deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// ── Upload Vehicle Images (Admin) ──────────────────────
router.post(
  '/:id/images',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN'),
  uploadVehicleImages,
  handleUploadError,
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }
      console.log(`[Upload] ${req.files.length} file(s) received. Has buffer: ${!!req.files[0].buffer}. Cloud: ${!!env.CLOUDINARY_CLOUD_NAME}`);
      const images = await inventoryService.addVehicleImages(req.params.id, req.files);
      res.status(201).json(images);
    } catch (err) {
      console.error('[Upload Error]', err);
      res.status(400).json({ error: err.message });
    }
  }
);

// ── Delete Vehicle Image (Admin) ───────────────────────
router.delete(
  '/:id/images/:imageId',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      await inventoryService.deleteVehicleImage(req.params.id, req.params.imageId);
      res.json({ message: 'Image deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

export default router;
