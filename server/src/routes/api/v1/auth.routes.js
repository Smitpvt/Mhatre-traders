import { Router } from 'express';
import { 
  login, 
  logout, 
  getCurrentUser, 
  updateProfile, 
  changePassword 
} from '../../../controllers/auth.controller.js';
import { protect } from '../../../middlewares/auth.middleware.js';
import { authLimiter } from '../../../middlewares/rateLimiter.js';
import { validateRequest } from '../../../middlewares/validator.js';
import { 
  loginValidator, 
  updateProfileValidator, 
  changePasswordValidator 
} from '../../../validators/auth.validator.js';

const router = Router();

// Public routes (login is rate-limited)
router.post('/login', authLimiter, loginValidator, validateRequest, login);
router.post('/logout', logout);

// Protected routes (require JWT verification)
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfileValidator, validateRequest, updateProfile);
router.put('/change-password', protect, changePasswordValidator, validateRequest, changePassword);

export default router;
