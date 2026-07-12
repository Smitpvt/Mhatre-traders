import { body } from 'express-validator';

const VALID_TRANSACTION_TYPES = ['PURCHASE', 'BILL', 'STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT'];

export const adjustStockValidator = [
  body('productId')
    .trim()
    .notEmpty().withMessage('Product ID is required')
    .isUUID().withMessage('Product ID must be a valid UUID'),
  body('quantity')
    .notEmpty().withMessage('Adjustment quantity is required')
    .isInt().withMessage('Adjustment quantity must be an integer (positive or negative)'),
  body('type')
    .trim()
    .notEmpty().withMessage('Transaction type is required')
    .toUpperCase()
    .isIn(VALID_TRANSACTION_TYPES).withMessage(`Invalid transaction type. Allowed: ${VALID_TRANSACTION_TYPES.join(', ')}`),
  body('notes')
    .optional()
    .trim()
];

export const updateInventoryValidator = [
  body('currentStock')
    .optional()
    .isInt({ min: 0 }).withMessage('Current stock level must be a non-negative integer'),
  body('reorderLevel')
    .optional()
    .isInt({ min: 0 }).withMessage('Reorder level must be a non-negative integer'),
  body('increaseStock')
    .optional()
    .isInt({ min: 1 }).withMessage('Increase stock units must be a positive integer'),
  body('reduceStock')
    .optional()
    .isInt({ min: 1 }).withMessage('Reduce stock units must be a positive integer')
];

export const recordPurchaseValidator = [
  body('productId')
    .optional({ nullable: true })
    .trim()
    .isUUID().withMessage('Product ID must be a valid UUID'),
  body('manualProductName')
    .optional({ nullable: true })
    .trim()
    .notEmpty().withMessage('Manual product name cannot be empty'),
  body('quantity')
    .notEmpty().withMessage('Purchase quantity is required')
    .isInt({ min: 1 }).withMessage('Purchase quantity must be a positive integer'),
  body('supplierName')
    .trim()
    .notEmpty().withMessage('Supplier name is required'),
  body('unitPrice')
    .notEmpty().withMessage('Unit purchase price is required')
    .isFloat({ min: 0 }).withMessage('Unit price must be a non-negative number'),
  body('totalPrice')
    .notEmpty().withMessage('Total purchase cost is required')
    .isFloat({ min: 0 }).withMessage('Total price must be a non-negative number'),
  body('transactionDate')
    .optional()
    .isISO8601().withMessage('Transaction date must be a valid ISO 8601 timestamp')
];
