import prisma from '../lib/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getSettings = asyncHandler(async (req, res, next) => {
  const settings = await prisma.setting.findMany({
    orderBy: { key: 'asc' }
  });

  res.status(200).json(new ApiResponse('Settings retrieved successfully', { settings }));
});

export const updateSetting = asyncHandler(async (req, res, next) => {
  const { key, value } = req.body;

  if (!key || value === undefined) {
    return next(new ApiError(400, 'Missing key or value properties'));
  }

  const setting = await prisma.setting.findUnique({
    where: { key }
  });

  if (!setting) {
    return next(new ApiError(404, `System setting for key "${key}" not found`));
  }

  const updated = await prisma.setting.update({
    where: { key },
    data: { value: String(value) }
  });

  res.status(200).json(new ApiResponse('Setting updated successfully', { setting: updated }));
});

export const updateCompanyDetails = asyncHandler(async (req, res, next) => {
  const updates = req.body; // Key-Value pair object: { company_name: "...", bank_name: "..." }

  if (!updates || typeof updates !== 'object') {
    return next(new ApiError(400, 'Invalid parameters payload'));
  }

  const keys = Object.keys(updates);
  
  const updateOperations = keys.map(key => 
    prisma.setting.updateMany({
      where: { key },
      data: { value: String(updates[key]) }
    })
  );

  // Execute all updates in a single roundtrip batch transaction
  await prisma.$transaction(updateOperations);

  // Re-fetch all updated settings at once to return the updated state
  const results = await prisma.setting.findMany({
    where: { key: { in: keys } }
  });

  res.status(200).json(new ApiResponse('Company settings updated successfully', { settings: results }));
});
