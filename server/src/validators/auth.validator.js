import { body } from 'express-validator';

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Please enter a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required')
];

export const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email')
    .optional()
    .trim()
    .notEmpty().withMessage('Email cannot be empty')
    .isEmail().withMessage('Please enter a valid email address')
];

export const changePasswordValidator = [
  body('oldPassword')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];
