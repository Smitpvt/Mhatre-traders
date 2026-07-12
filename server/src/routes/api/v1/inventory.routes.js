import { Router } from 'express';
import { 
  getInventory, 
  adjustStock, 
  getInventoryHistory,
  updateInventory,
  recordPurchase
} from '../../../controllers/inventory.controller.js';
import { protect } from '../../../middlewares/auth.middleware.js';
import { validateRequest } from '../../../middlewares/validator.js';
import { 
  adjustStockValidator, 
  updateInventoryValidator, 
  recordPurchaseValidator 
} from '../../../validators/inventory.validator.js';

const router = Router();

// Gated routes for stock inventory managers
router.use(protect);

router.get('/', getInventory);
router.post('/adjust', adjustStockValidator, validateRequest, adjustStock);
router.post('/purchase', recordPurchaseValidator, validateRequest, recordPurchase);
router.put('/:productId', updateInventoryValidator, validateRequest, updateInventory);
router.get('/history', getInventoryHistory);

export default router;
