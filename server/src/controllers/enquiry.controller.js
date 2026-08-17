import prisma from '../lib/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Create a new enquiry (Public)
export const createEnquiry = asyncHandler(async (req, res, next) => {
  const { name, company, email, phone, category, message } = req.body;

  const enquiry = await prisma.enquiry.create({
    data: {
      customerName: name,
      company: company || null,
      email: email || null,
      phone,
      category,
      message,
      status: 'NEW'
    }
  });

  res.status(201).json(new ApiResponse('Enquiry submitted successfully', { enquiry }));
});

// Retrieve all enquiries (Admin)
export const getEnquiries = asyncHandler(async (req, res, next) => {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json(new ApiResponse('Enquiries retrieved successfully', { enquiries }));
});

// Update enquiry status (Admin)
export const updateEnquiryStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const enquiry = await prisma.enquiry.findUnique({
    where: { id }
  });

  if (!enquiry) {
    return next(new ApiError(404, 'Enquiry not found'));
  }

  const updated = await prisma.enquiry.update({
    where: { id },
    data: { status }
  });

  res.status(200).json(new ApiResponse(`Enquiry status updated to ${status}`, { enquiry: updated }));
});

// Delete an enquiry (Admin)
export const deleteEnquiry = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const enquiry = await prisma.enquiry.findUnique({
    where: { id }
  });

  if (!enquiry) {
    return next(new ApiError(404, 'Enquiry not found'));
  }

  await prisma.enquiry.delete({
    where: { id }
  });

  res.status(200).json(new ApiResponse('Enquiry deleted successfully', null));
});
