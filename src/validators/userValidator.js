// src/validators/userValidator.js
import Joi from 'joi';

export const userSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('ADMIN', 'STAFF', 'CLIENT').optional(),
  // Google tokens are managed internally, but allow optional validation for completeness
  googleAccessToken: Joi.string().allow(null).optional(),
  googleRefreshToken: Joi.string().allow(null).optional(),
  googleTokenExpiry: Joi.date().iso().allow(null).optional(),
});

export const validateUser = (data) => userSchema.validate(data, { abortEarly: false });
