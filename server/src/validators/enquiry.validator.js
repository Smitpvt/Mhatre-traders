import { body } from 'express-validator';

export const createEnquiryValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Full Name is required'),
  body('company')
    .optional()
    .trim(),
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail().withMessage('Please enter a valid email address'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required'),
  body('category')
    .trim()
    .notEmpty().withMessage('Material category is required'),
  body('message')
    .trim()
    .notEmpty().withMessage('Requirement details/message is required')
];

export const updateEnquiryStatusValidator = [
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['NEW', 'CONTACTED', 'COMPLETED']).withMessage('Invalid status value. Must be NEW, CONTACTED, or COMPLETED')
];
