import { body } from 'express-validator';

const VALID_UNITS = [
  'BAG', 'PIECE', 'KG', 'TON', 'BOX', 'BUNDLE', 
  'FEET', 'METER', 'SHEET', 'CM', 'INCH', 'LITER'
];

const VALID_STATUSES = ['ACTIVE', 'INACTIVE', 'DRAFT'];

export const createProductValidator = [
  body('sku')
    .trim()
    .notEmpty().withMessage('SKU code is required')
    .isAlphanumeric('en-US', { ignore: '-_' }).withMessage('SKU code can only contain alphanumeric characters, dashes, and underscores'),
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2, max: 150 }).withMessage('Product name must be between 2 and 150 characters'),
  body('categoryId')
    .trim()
    .notEmpty().withMessage('Category ID is required')
    .isUUID().withMessage('Category ID must be a valid UUID'),
  body('unit')
    .trim()
    .notEmpty().withMessage('Unit type is required')
    .toUpperCase()
    .isIn(VALID_UNITS).withMessage(`Invalid unit type. Allowed: ${VALID_UNITS.join(', ')}`),
  body('status')
    .optional()
    .trim()
    .toUpperCase()
    .isIn(VALID_STATUSES).withMessage(`Invalid product status. Allowed: ${VALID_STATUSES.join(', ')}`),
  body('featured')
    .optional()
    .customSanitizer(val => val === 'true' || val === true),
  body('purchasePrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Purchase price must be a non-negative number'),
  body('sellingPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Selling price must be a non-negative number'),
  body('defaultBillingRate')
    .optional()
    .isFloat({ min: 0 }).withMessage('Default billing rate must be a non-negative number'),
  body('gstRate')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('GST rate must be between 0 and 100 percent'),
  body('currentStock')
    .optional()
    .isInt({ min: 0 }).withMessage('Current stock must be a non-negative integer'),
  body('reorderLevel')
    .optional()
    .isInt({ min: 0 }).withMessage('Reorder level must be a non-negative integer')
];

export const updateProductValidator = [
  body('sku')
    .optional()
    .trim()
    .notEmpty().withMessage('SKU code cannot be empty')
    .isAlphanumeric('en-US', { ignore: '-_' }).withMessage('SKU code can only contain alphanumeric characters, dashes, and underscores'),
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Product name cannot be empty')
    .isLength({ min: 2, max: 150 }).withMessage('Product name must be between 2 and 150 characters'),
  body('categoryId')
    .optional()
    .trim()
    .isUUID().withMessage('Category ID must be a valid UUID'),
  body('unit')
    .optional()
    .trim()
    .toUpperCase()
    .isIn(VALID_UNITS).withMessage(`Invalid unit type. Allowed: ${VALID_UNITS.join(', ')}`),
  body('status')
    .optional()
    .trim()
    .toUpperCase()
    .isIn(VALID_STATUSES).withMessage(`Invalid product status. Allowed: ${VALID_STATUSES.join(', ')}`),
  body('featured')
    .optional()
    .customSanitizer(val => val === 'true' || val === true),
  body('purchasePrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Purchase price must be a non-negative number'),
  body('sellingPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Selling price must be a non-negative number'),
  body('defaultBillingRate')
    .optional()
    .isFloat({ min: 0 }).withMessage('Default billing rate must be a non-negative number'),
  body('gstRate')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('GST rate must be between 0 and 100 percent'),
  body('reorderLevel')
    .optional()
    .isInt({ min: 0 }).withMessage('Reorder level must be a non-negative integer')
];
