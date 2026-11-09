import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadLogo, handleUploadError } from '../middleware/upload.js';
import * as settingsService from '../services/settingsService.js';

const router = Router();

// ── Get All Settings (Public) ──────────────────────────
router.get('/', async (req, res) => {
  try {
    const settings = await settingsService.getAllSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get Single Setting (Public) ────────────────────────
router.get('/:key', async (req, res) => {
  try {
    const setting = await settingsService.getSettingByKey(req.params.key);
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Update Setting (Admin) ─────────────────────────────
const updateSettingSchema = z.object({
  value: z.string(),
  type: z.enum(['TEXT', 'IMAGE', 'HTML']).optional(),
});

router.put(
  '/:key',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN'),
  validate(updateSettingSchema),
  async (req, res) => {
    try {
      const setting = await settingsService.updateSetting(
        req.params.key,
        req.validatedBody.value,
        req.validatedBody.type,
        req.user.id
      );
      res.json(setting);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// ── Batch Update Settings (Admin) ──────────────────────
const batchUpdateSchema = z.object({
  settings: z.record(
    z.object({
      value: z.string(),
      type: z.enum(['TEXT', 'IMAGE', 'HTML']).optional(),
    })
  ),
});

router.put(
  '/',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN'),
  validate(batchUpdateSchema),
  async (req, res) => {
    try {
      const results = await settingsService.updateSettingsBatch(
        req.validatedBody.settings,
        req.user.id
      );
      res.json(results);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// ── Upload Logo (Admin) ────────────────────────────────
router.post(
  '/logo',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN'),
  uploadLogo,
  handleUploadError,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const logoUrl = `logos/${req.file.filename}`;
      const setting = await settingsService.updateSetting(
        'logo_url',
        logoUrl,
        'IMAGE',
        req.user.id
      );
      res.json({ logoUrl, setting });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

export default router;
