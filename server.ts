import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Backend Configuration, Database & Seeder
import { connectDB } from './backend/src/config/db';
import { seedDatabaseIfEmpty } from './backend/src/utils/seedData';

// Backend API Routes
import portfolioRoutes from './backend/src/routes/portfolioRoutes';
import visitorRoutes from './backend/src/routes/visitorRoutes';
import messageRoutes from './backend/src/routes/messageRoutes';
import authRoutes from './backend/src/routes/authRoutes';
import adminRoutes from './backend/src/routes/adminRoutes';
import aiRoutes from './backend/src/routes/aiRoutes';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Enable Cross-Origin Resource Sharing & JSON Parsing
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Gnani Full-Stack Architecture Service',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Shared Backend REST API Routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Dev & Production Frontend Serving
async function startServer() {
  // 1. Connect to MongoDB Atlas (if MONGODB_URI is provided) and seed collections
  await connectDB();
  await seedDatabaseIfEmpty();

  // 2. Setup Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [Gnani System] Full-Stack Unified Server listening on http://localhost:${PORT}`);
    console.log(`🌐 Public Portfolio:  http://localhost:${PORT}`);
    console.log(`📡 Backend API:       http://localhost:${PORT}/api/portfolio`);
    console.log(`👤 Visitor Tracking:  http://localhost:${PORT}/api/visitors`);
    console.log(`✉️ Contact Messages:  http://localhost:${PORT}/api/messages`);
    console.log(`🔐 Admin Auth & CMS:  http://localhost:${PORT}/api/auth/login & /api/admin/*`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
