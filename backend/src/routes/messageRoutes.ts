import { Router } from 'express';
import {
  createMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage,
} from '../controllers/messageController.js';
import { verifyAdminToken } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public: Contact form submission with rate limiting (max 5 per 10 mins per IP)
router.post('/', rateLimiter(10 * 60 * 1000, 5, 'Message rate limit exceeded. Please wait 10 minutes.'), createMessage);

// Admin: Message management (protected)
router.get('/', verifyAdminToken, getMessages);
router.put('/:id', verifyAdminToken, updateMessageStatus);
router.delete('/:id', verifyAdminToken, deleteMessage);

export default router;
