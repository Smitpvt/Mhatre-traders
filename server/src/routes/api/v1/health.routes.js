import { Router } from 'express';
import { ApiResponse } from '../../../utils/apiResponse.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const healthData = {
    status: 'UP',
    uptime: Number(process.uptime().toFixed(2)),
    nodeVersion: process.version,
    apiVersion: 'v1',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  };

  res.status(200).json(new ApiResponse('Server is healthy', healthData));
}));

export default router;
