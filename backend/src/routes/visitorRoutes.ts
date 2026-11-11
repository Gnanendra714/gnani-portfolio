import { Router } from 'express';
import { trackVisitor, getVisitors } from '../controllers/visitorController.js';
import { verifyAdminToken } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public: Track new / returning visitor
router.post('/', rateLimiter(60000, 30), trackVisitor);

// Admin: Get visitor analytics list (protected)
router.get('/', verifyAdminToken, getVisitors);

export default router;
