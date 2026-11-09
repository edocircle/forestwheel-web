import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as dashboardService from '../services/dashboardService.js';

const router = Router();

// All dashboard routes require authentication
router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'ADMIN'));

// ── Dashboard Stats ────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const stats = await dashboardService.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Activity Feed ──────────────────────────────────────
router.get('/activity', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '20', 10);
    const activities = await dashboardService.getActivityFeed(limit);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Lead Analytics ─────────────────────────────────────
router.get('/analytics', async (req, res) => {
  try {
    const analytics = await dashboardService.getLeadAnalytics();
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
