import { Router } from 'express';
import { 
  getInventory, 
  adjustStock, 
  getInventoryHistory,
  updateInventory,
  recordPurchase
} from '../../../controllers/inventory.controller.js';
import { protect } from '../../../middlewares/auth.middleware.js';

const router = Router();

// Gated routes for stock inventory managers
router.use(protect);

router.get('/', getInventory);
router.post('/adjust', adjustStock);
router.post('/purchase', recordPurchase);
router.put('/:productId', updateInventory);
router.get('/history', getInventoryHistory);

export default router;
