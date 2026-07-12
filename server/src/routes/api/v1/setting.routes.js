import { Router } from 'express';
import { 
  getSettings, 
  updateSetting, 
  updateCompanyDetails 
} from '../../../controllers/setting.controller.js';
import { protect } from '../../../middlewares/auth.middleware.js';
import { validateRequest } from '../../../middlewares/validator.js';
import { 
  updateSettingValidator, 
  updateCompanyDetailsValidator 
} from '../../../validators/setting.validator.js';

const router = Router();

// Gated routes for admin managers
router.use(protect);

router.get('/', getSettings);
router.put('/', updateSettingValidator, validateRequest, updateSetting);
router.put('/company', updateCompanyDetailsValidator, validateRequest, updateCompanyDetails);

export default router;
