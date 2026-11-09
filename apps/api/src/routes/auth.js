import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import * as authService from '../services/authService.js';
import { sendPasswordResetEmail } from '../services/emailService.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// ── Login ──────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const result = await authService.login(req.validatedBody.email, req.validatedBody.password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// ── Activate Account ───────────────────────────────────
router.post('/activate/:token', async (req, res) => {
  try {
    const result = await authService.activateAccount(req.params.token);
    res.json({ message: 'Account activated successfully', ...result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Set Password (after activation) ───────────────────
const setPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post('/set-password', validate(setPasswordSchema), async (req, res) => {
  try {
    await authService.setPassword(req.validatedBody.email, req.validatedBody.password);
    res.json({ message: 'Password set successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Forgot Password ───────────────────────────────────
const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

router.post('/forgot-password', validate(forgotPasswordSchema), async (req, res) => {
  try {
    const result = await authService.generateResetToken(req.validatedBody.email);
    if (result) {
      await sendPasswordResetEmail(req.validatedBody.email, result.fullName, result.resetToken);
    }
    // Always return success to prevent email enumeration
    res.json({ message: 'If the email exists, a reset link has been sent.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Reset Password ─────────────────────────────────────
const resetPasswordSchema = z.object({
  password: z.string().min(8),
});

router.post('/reset-password/:token', validate(resetPasswordSchema), async (req, res) => {
  try {
    await authService.resetPassword(req.params.token, req.validatedBody.password);
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Get Profile (authenticated) ────────────────────────
router.get('/me', authenticate, async (req, res) => {
  try {
    const profile = await authService.getProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

export default router;
