import { Router } from 'express';
import { 
  getEnquiries, 
  updateEnquiryStatus, 
  deleteEnquiry 
} from '../../../controllers/enquiry.controller.js';
import { protect } from '../../../middlewares/auth.middleware.js';
import { validateRequest } from '../../../middlewares/validator.js';
import { updateEnquiryStatusValidator } from '../../../validators/enquiry.validator.js';

const router = Router();

// Gated routes for admin enquiries management
router.use(protect);

router.get('/', getEnquiries);
router.put('/:id/status', updateEnquiryStatusValidator, validateRequest, updateEnquiryStatus);
router.delete('/:id', deleteEnquiry);

export default router;
