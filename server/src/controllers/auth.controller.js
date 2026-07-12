import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import prisma from '../lib/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Helper to sign JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

// Helper to set HTTP-only cookie
const setCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });
};

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!user) {
    return next(new ApiError(401, 'Invalid email or password'));
  }

  const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordMatch) {
    return next(new ApiError(401, 'Invalid email or password'));
  }

  const tokenPayload = { id: user.id, email: user.email, role: user.role };
  const token = generateToken(tokenPayload);
  setCookie(res, token);

  const userData = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };

  res.status(200).json(new ApiResponse('Login successful', { token, user: userData }));
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'strict',
    secure: env.NODE_ENV === 'production'
  });

  res.status(200).json(new ApiResponse('Logout successful'));
});

export const getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  if (!user) {
    return next(new ApiError(404, 'User session not found'));
  }

  const userData = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };

  res.status(200).json(new ApiResponse('Profile retrieved successfully', { user: userData }));
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;
  const updateData = {};

  if (name) updateData.name = name;
  if (email) {
    const parsedEmail = email.toLowerCase();
    
    // Check if email already registered by another user
    const existingUser = await prisma.user.findUnique({
      where: { email: parsedEmail }
    });
    
    if (existingUser && existingUser.id !== req.user.id) {
      return next(new ApiError(400, 'Email address is already in use'));
    }
    
    updateData.email = parsedEmail;
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData
  });

  const userData = {
    id: updatedUser.id,
    email: updatedUser.email,
    name: updatedUser.name,
    role: updatedUser.role
  };

  res.status(200).json(new ApiResponse('Profile updated successfully', { user: userData }));
});

export const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  if (!user) {
    return next(new ApiError(404, 'User session not found'));
  }

  const isPasswordMatch = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isPasswordMatch) {
    return next(new ApiError(400, 'Incorrect current password'));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: req.user.id },
    data: { passwordHash: hashedPassword }
  });

  res.status(200).json(new ApiResponse('Password changed successfully'));
});
