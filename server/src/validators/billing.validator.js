import { body } from 'express-validator';

const VALID_BILL_TYPES = ['GST', 'NON_GST'];
const VALID_PAYMENT_MODES = ['CASH', 'ONLINE', 'CHEQUE', 'BANK_TRANSFER'];
const VALID_PAYMENT_STATUSES = ['PENDING', 'PARTIAL', 'PAID'];

export const createBillValidator = [
  body('customerName')
    .trim()
    .notEmpty().withMessage('Customer name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Customer name must be between 2 and 100 characters'),
  body('customerPhone')
    .trim()
    .notEmpty().withMessage('Customer phone number is required')
    .isLength({ min: 10, max: 15 }).withMessage('Phone number must be between 10 and 15 digits'),
  body('customerGst')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .withMessage('Invalid GSTIN format (Standard 15-character Indian GSTIN required)'),
  body('billingAddress')
    .trim()
    .notEmpty().withMessage('Billing address is required'),
  body('deliveryAddress')
    .optional()
    .trim(),
  body('placeOfSupply')
    .optional()
    .trim(),
  body('billType')
    .trim()
    .notEmpty().withMessage('Bill invoice type is required')
    .toUpperCase()
    .isIn(VALID_BILL_TYPES).withMessage(`Invalid bill type. Allowed: ${VALID_BILL_TYPES.join(', ')}`),
  body('paymentMode')
    .trim()
    .notEmpty().withMessage('Payment mode is required')
    .toUpperCase()
    .isIn(VALID_PAYMENT_MODES).withMessage(`Invalid payment mode. Allowed: ${VALID_PAYMENT_MODES.join(', ')}`),
  body('paymentStatus')
    .optional()
    .trim()
    .toUpperCase()
    .isIn(VALID_PAYMENT_STATUSES).withMessage(`Invalid payment status. Allowed: ${VALID_PAYMENT_STATUSES.join(', ')}`),
  body('items')
    .isArray({ min: 1 }).withMessage('Invoice checkout requires at least one billing item row'),
  body('items.*.productId')
    .trim()
    .notEmpty().withMessage('Product ID is required for checkout items')
    .isUUID().withMessage('Product ID must be a valid UUID'),
  body('items.*.quantity')
    .notEmpty().withMessage('Quantity is required for checkout items')
    .isInt({ min: 1 }).withMessage('Item quantity must be a positive integer'),
  body('items.*.unitPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Unit price must be a non-negative number'),
  body('items.*.discount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Item discount must be a non-negative number'),
  body('items.*.gstRate')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('Item GST rate must be between 0 and 100 percent')
];
