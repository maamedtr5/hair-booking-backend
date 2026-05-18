// src/validators/clientValidator.js
import Joi from 'joi';

export const clientSchema = Joi.object({
  userId: Joi.number().integer().required(),
  phone: Joi.string().allow('', null).optional(),
  address: Joi.string().allow('', null).optional(),
});

export const validateClient = (data) => clientSchema.validate(data, { abortEarly: false });
