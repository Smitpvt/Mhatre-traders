import { Router } from 'express';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../../../controllers/category.controller.js';
import { protect } from '../../../middlewares/auth.middleware.js';
import { upload } from '../../../middlewares/upload.middleware.js';
import { validateRequest } from '../../../middlewares/validator.js';
import { 
  createCategoryValidator, 
  updateCategoryValidator 
} from '../../../validators/category.validator.js';

const router = Router();

// Gated routes for admin panel categories
router.use(protect);

router.get('/', getCategories);
router.post('/', upload.single('image'), createCategoryValidator, validateRequest, createCategory);
router.put('/:id', upload.single('image'), updateCategoryValidator, validateRequest, updateCategory);
router.delete('/:id', deleteCategory);

export default router;
