// validators/clientValidator.js
import { body, param } from 'express-validator';
import { handleValidationErrors, isGhanaPhone, sanitizePhone } from './validationHelpers.js';

export const validateClientCreate = [
  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isInt({ min: 1 }).withMessage('Invalid user ID'),

  body('phone')
    .optional()
    .trim()
    .customSanitizer(sanitizePhone)
    .custom((value) => {
      if (value && !isGhanaPhone(value)) {
        throw new Error('Invalid Ghana phone number format');
      }
      return true;
    }),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Address must not exceed 200 characters'),

  handleValidationErrors,
];

export const validateClientUpdate = [
  param('id')
    .isInt().withMessage('Invalid client ID'),

  body('phone')
    .optional()
    .trim()
    .customSanitizer(sanitizePhone)
    .custom((value) => {
      if (value && !isGhanaPhone(value)) {
        throw new Error('Invalid Ghana phone number format');
      }
      return true;
    }),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Address must not exceed 200 characters'),

  handleValidationErrors,
];