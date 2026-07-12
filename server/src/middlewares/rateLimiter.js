import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: env.NODE_ENV === 'production' ? 100 : 1000, 
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    errors: []
  },
  statusCode: 429
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: env.NODE_ENV === 'production' ? 10 : 100, // Stricter limit on sensitive auth paths
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
    errors: []
  },
  statusCode: 429
});
export default globalLimiter;
