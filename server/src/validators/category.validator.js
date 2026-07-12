import { body } from 'express-validator';

export const createCategoryValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Category title is required')
    .isLength({ min: 2, max: 100 }).withMessage('Category title must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim(),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 }).withMessage('Display order must be a non-negative integer'),
  body('visibility')
    .optional()
    .customSanitizer(val => val === 'true' || val === true)
];

export const updateCategoryValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Category title cannot be empty')
    .isLength({ min: 2, max: 100 }).withMessage('Category title must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim(),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 }).withMessage('Display order must be a non-negative integer'),
  body('visibility')
    .optional()
    .customSanitizer(val => val === 'true' || val === true)
];
