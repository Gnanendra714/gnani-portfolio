import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

/**
 * Lightweight in-memory rate limiter
 * @param windowMs Time window in milliseconds
 * @param max Max requests allowed in window
 */
export function rateLimiter(windowMs: number, max: number, message = 'Too many requests. Please try again later.') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${req.baseUrl}${req.path}_${ip}`;
    const now = Date.now();

    const record = memoryStore.get(key);

    if (!record || now > record.resetAt) {
      memoryStore.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (record.count >= max) {
      res.status(429).json({
        success: false,
        error: message,
        retryAfterMs: record.resetAt - now,
      });
      return;
    }

    record.count += 1;
    next();
  };
}
