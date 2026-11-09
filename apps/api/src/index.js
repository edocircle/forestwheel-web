import express from 'express';
import cors from 'cors';
import path from 'path';
import env from './config/env.js';

// Route imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import inventoryRoutes from './routes/inventory.js';
import leadRoutes from './routes/leads.js';
import settingsRoutes from './routes/settings.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    // Check if the origin matches forestwheel.com or localhost
    const isAllowed = origin.endsWith('forestwheel.com') || 
                      origin.includes('localhost') || 
                      origin.includes('127.0.0.1');
                      
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(env.UPLOAD_DIR));

// ── Health Check ───────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ── API Routes ─────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ── 404 Handler ────────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ── Global Error Handler ───────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// ── Start Server ───────────────────────────────────────
app.listen(env.PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║       🚗 Forest Wheel API Server              ║
║       Running on port ${env.PORT}                   ║
║       Environment: ${env.NODE_ENV}              ║
║       Uploads: ${env.UPLOAD_DIR}   ║
╚═══════════════════════════════════════════════╝
  `);
});

export default app;
