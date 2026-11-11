import "dotenv/config";

import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import { seedDatabaseIfEmpty } from "./utils/seedData.js";

// Routes
import portfolioRoutes from "./routes/portfolioRoutes.js";
import visitorRoutes from "./routes/visitorRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Gnani Portfolio Backend API",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);

// Global error handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Unhandled server error:", err);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  },
);

async function bootstrap() {
  // 1. Connect to MongoDB Atlas
  await connectDB();

  // 2. Seed initial data if collections are empty
  await seedDatabaseIfEmpty();

  // 3. Start listening
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 [Backend API] Server running on http://localhost:${PORT}`);
    console.log(`📡 [Endpoints]`);
    console.log(
      `   - Public Portfolio: http://localhost:${PORT}/api/portfolio`,
    );
    console.log(`   - Visitor Tracking: http://localhost:${PORT}/api/visitors`);
    console.log(`   - Contact Messages: http://localhost:${PORT}/api/messages`);
    console.log(
      `   - Admin Auth:       http://localhost:${PORT}/api/auth/login`,
    );
    console.log(`   - Admin CMS:        http://localhost:${PORT}/api/admin/*`);
    console.log(`   - AI Services:      http://localhost:${PORT}/api/ai/*`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start backend server:", err);
  process.exit(1);
});

export default app;
