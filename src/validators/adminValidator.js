// src/validators/adminValidator.js
import Joi from 'joi';

export const adminSchema = Joi.object({
  userId: Joi.number().integer().required(),
  permissions: Joi.object().unknown(true).optional(),
  department: Joi.string().allow('', null).optional(),
});

export const validateAdmin = (data) => adminSchema.validate(data, { abortEarly: false });
