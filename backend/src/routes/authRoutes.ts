import { Router } from 'express';
import { login, getMe, updateProfile } from '../controllers/authController.js';
import { verifyAdminToken } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Admin login: max 10 attempts per 15 minutes per IP
router.post('/login', rateLimiter(15 * 60 * 1000, 10, 'Too many login attempts. Please wait 15 minutes.'), login);

// Admin session verification
router.get('/me', verifyAdminToken, getMe);

// Update profile / password
router.put('/profile', verifyAdminToken, updateProfile);

export default router;
