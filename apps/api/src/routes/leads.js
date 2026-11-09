import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { authenticate, authorize } from '../middleware/auth.js';
import * as leadService from '../services/leadService.js';

const router = Router();

// ── Submit Lead (Public — from "Sell Your Car" form) ───
const createLeadSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  vehicleMake: z.string().min(1),
  vehicleModel: z.string().min(1),
  vehicleYear: z.union([z.number(), z.string()]).optional(),
  vehicleMileage: z.union([z.number(), z.string()]).optional(),
  registrationDate: z.string().optional(),
  carPlate: z.string().min(1),
  accessCode: z.string().optional(),
});

router.post('/', validate(createLeadSchema), async (req, res) => {
  try {
    const lead = await leadService.createLead(req.validatedBody);
    res.status(201).json({
      message: 'Your valuation request has been submitted successfully.',
      inquiryNumber: lead.inquiryNumber,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── All routes below require admin authentication ──────
router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'ADMIN'));

// ── List Leads ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { page, limit, status, search, sortBy, sortOrder } = req.query;
    const result = await leadService.listLeads({
      page: parseInt(page || '1', 10),
      limit: parseInt(limit || '10', 10),
      status: status || null,
      search: search || '',
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc',
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get Lead Status Counts ─────────────────────────────
router.get('/status-counts', async (req, res) => {
  try {
    const counts = await leadService.getLeadStatusCounts();
    res.json(counts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get Lead Detail ────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const lead = await leadService.getLeadById(req.params.id);
    res.json(lead);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// ── Update Lead ────────────────────────────────────────
const updateLeadSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'IN_PROGRESS', 'SOLD', 'ARCHIVED']).optional(),
  notes: z.string().optional(),
  assignedToId: z.string().uuid().optional().nullable(),
});

router.put('/:id', validate(updateLeadSchema), async (req, res) => {
  try {
    const lead = await leadService.updateLead(req.params.id, req.validatedBody, req.user.id);
    res.json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Delete Lead ────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    await leadService.deleteLead(req.params.id);
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
