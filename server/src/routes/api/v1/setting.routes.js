import { Router } from 'express';
import { 
  getSettings, 
  updateSetting, 
  updateCompanyDetails 
} from '../../../controllers/setting.controller.js';
import { protect } from '../../../middlewares/auth.middleware.js';

const router = Router();

// Gated routes for admin managers
router.use(protect);

router.get('/', getSettings);
router.put('/', updateSetting);
router.put('/company', updateCompanyDetails);

export default router;
