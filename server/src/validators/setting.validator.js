import { body } from 'express-validator';

export const updateSettingValidator = [
  body('key')
    .trim()
    .notEmpty().withMessage('Setting key is required'),
  body('value')
    .exists().withMessage('Setting value is required')
];

export const updateCompanyDetailsValidator = [
  body('company_name')
    .optional()
    .trim()
    .notEmpty().withMessage('Company name cannot be empty'),
  body('company_email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail().withMessage('Company contact email must be a valid email address'),
  body('company_phone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 10, max: 15 }).withMessage('Company phone must be between 10 and 15 digits'),
  body('company_gstin')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .withMessage('Invalid Company GSTIN format (Standard 15-character Indian GSTIN required)'),
  body('bank_ifsc')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
    .withMessage('Invalid Bank IFSC code format (e.g. SBIN0001234)')
];
