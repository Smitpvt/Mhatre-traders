import { Router } from 'express';
import healthRouter from './health.routes.js';
import authRouter from './auth.routes.js';
import categoryRouter from './category.routes.js';
import productRouter from './product.routes.js';
import inventoryRouter from './inventory.routes.js';
import billingRouter from './billing.routes.js';
import settingRouter from './setting.routes.js';
import publicRouter from './public.routes.js';
import dashboardRouter from './dashboard.routes.js';
import enquiryRouter from './enquiry.routes.js';

const router = Router();

// Mount system health checker
router.use('/health', healthRouter);

// Mount authentication controller routes
router.use('/auth', authRouter);

// Mount admin panel operational routes
router.use('/admin/dashboard', dashboardRouter);
router.use('/admin/categories', categoryRouter);
router.use('/admin/products', productRouter);
router.use('/admin/inventory', inventoryRouter);
router.use('/admin/billing', billingRouter);
router.use('/admin/settings', settingRouter);
router.use('/admin/enquiries', enquiryRouter);

// Mount public catalog site routes
router.use('/public', publicRouter);

export default router;
