import { Router } from 'express';
import { getDashboardStats } from '../../../controllers/dashboard.controller.js';
import { protect } from '../../../middlewares/auth.middleware.js';

const router = Router();

// Gated routes for admin dashboard views
router.use(protect);

router.get('/stats', getDashboardStats);

export default router;
