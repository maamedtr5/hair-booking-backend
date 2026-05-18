// src/validators/serviceValidator.js
import Joi from 'joi';

export const serviceSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow('', null).optional(),
  duration: Joi.number().integer().min(1).required(), // minutes
  price: Joi.number().precision(2).required(),
  isActive: Joi.boolean().optional(),
});

export const validateService = (data) => serviceSchema.validate(data, { abortEarly: false });
