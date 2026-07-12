import { Router } from 'express';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../../../controllers/category.controller.js';
import { protect } from '../../../middlewares/auth.middleware.js';
import { upload } from '../../../middlewares/upload.middleware.js';

const router = Router();

// Gated routes for admin panel categories
router.use(protect);

router.get('/', getCategories);
router.post('/', upload.single('image'), createCategory);
router.put('/:id', upload.single('image'), updateCategory);
router.delete('/:id', deleteCategory);

export default router;
