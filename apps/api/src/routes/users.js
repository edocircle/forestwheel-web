import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { authenticate, authorize } from '../middleware/auth.js';
import * as userService from '../services/userService.js';
import { sendActivationEmail } from '../services/emailService.js';

const router = Router();

// All user routes require authentication and admin role
router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'ADMIN'));

// ── List Users ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { page, limit, role, search } = req.query;
    const result = await userService.listUsers({
      page: parseInt(page || '1', 10),
      limit: parseInt(limit || '10', 10),
      role: role || null,
      search: search || '',
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Create User ────────────────────────────────────────
const createUserSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(1),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'USER']).default('USER'),
});

router.post('/', validate(createUserSchema), async (req, res) => {
  try {
    // Only SUPER_ADMIN can create other admins
    if (
      ['SUPER_ADMIN', 'ADMIN'].includes(req.validatedBody.role) &&
      req.user.role !== 'SUPER_ADMIN'
    ) {
      return res.status(403).json({ error: 'Only Super Admins can create admin accounts' });
    }

    const { user, activationToken } = await userService.createUser(req.validatedBody);

    // Send activation email
    await sendActivationEmail(user.email, user.fullName, activationToken);

    res.status(201).json({ user, message: 'User created. Activation email sent.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Get User ───────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// ── Update User ────────────────────────────────────────
const updateUserSchema = z.object({
  fullName: z.string().min(1).optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'USER']).optional(),
  isActive: z.boolean().optional(),
});

router.put('/:id', validate(updateUserSchema), async (req, res) => {
  try {
    // Only SUPER_ADMIN can change roles to admin
    if (
      req.validatedBody.role &&
      ['SUPER_ADMIN', 'ADMIN'].includes(req.validatedBody.role) &&
      req.user.role !== 'SUPER_ADMIN'
    ) {
      return res.status(403).json({ error: 'Only Super Admins can assign admin roles' });
    }

    const user = await userService.updateUser(req.params.id, req.validatedBody);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Delete (Deactivate) User ───────────────────────────
router.delete('/:id', authorize('SUPER_ADMIN'), async (req, res) => {
  try {
    // Prevent self-deletion
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot deactivate your own account' });
    }

    await userService.deleteUser(req.params.id);
    res.json({ message: 'User deactivated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Resend Activation Email ────────────────────────────
router.post('/:id/resend-activation', async (req, res) => {
  try {
    const { email, fullName, activationToken } = await userService.regenerateActivationToken(
      req.params.id
    );
    await sendActivationEmail(email, fullName, activationToken);
    res.json({ message: 'Activation email resent successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
