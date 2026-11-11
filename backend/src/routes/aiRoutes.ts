import { Router } from 'express';
import { chatCopilot, circuitArchitect, evaluateJobDescription } from '../controllers/aiController.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// AI endpoints with reasonable rate limits
router.post('/chat', rateLimiter(60000, 20), chatCopilot);
router.post('/architect', rateLimiter(60000, 15), circuitArchitect);
router.post('/evaluate-jd', rateLimiter(60000, 15), evaluateJobDescription);

export default router;
