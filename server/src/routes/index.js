import { Router } from 'express';
import v1Router from './api/v1/index.js';

const router = Router();

// Mount the api v1 routing table
router.use('/api/v1', v1Router);

export default router;
