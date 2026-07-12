import { Router } from 'express';
import { 
  getBills, 
  getBillById, 
  createBill, 
  updatePaymentStatus, 
  getBillPdf 
} from '../../../controllers/billing.controller.js';
import { protect } from '../../../middlewares/auth.middleware.js';

const router = Router();

// Gated routes for invoice managers
router.use(protect);

router.get('/', getBills);
router.post('/', createBill);
router.get('/:id', getBillById);
router.put('/:id/payment-status', updatePaymentStatus);
router.get('/:id/pdf', getBillPdf);

export default router;
