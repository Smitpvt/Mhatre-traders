import { Router } from 'express';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../../../controllers/product.controller.js';
import { protect } from '../../../middlewares/auth.middleware.js';
import { upload } from '../../../middlewares/upload.middleware.js';
import { validateRequest } from '../../../middlewares/validator.js';
import { 
  createProductValidator, 
  updateProductValidator 
} from '../../../validators/product.validator.js';

const router = Router();

// Gated routes for admin panel products
router.use(protect);

router.get('/', getProducts);
router.post('/', upload.array('images', 6), createProductValidator, validateRequest, createProduct);
router.put('/:id', upload.array('images', 6), updateProductValidator, validateRequest, updateProduct);
router.delete('/:id', deleteProduct);

export default router;
