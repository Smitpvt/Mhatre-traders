import { Router } from 'express';
import { 
  getBills, 
  getBillById, 
  createBill, 
  updatePaymentStatus, 
  getBillPdf,
  deleteBill,
  exportBillsExcel
} from '../../../controllers/billing.controller.js';
import { protect } from '../../../middlewares/auth.middleware.js';
import { validateRequest } from '../../../middlewares/validator.js';
import { createBillValidator } from '../../../validators/billing.validator.js';

const router = Router();

// Gated routes for invoice managers
router.use(protect);

router.get('/', getBills);
router.get('/export-excel', exportBillsExcel);
router.post('/', createBillValidator, validateRequest, createBill);
router.get('/:id', getBillById);
router.put('/:id/payment-status', updatePaymentStatus);
router.get('/:id/pdf', getBillPdf);
router.delete('/:id', deleteBill);

export default router;
