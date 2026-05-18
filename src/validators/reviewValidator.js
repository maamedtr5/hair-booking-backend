// src/validators/reviewValidator.js
import Joi from 'joi';

export const reviewSchema = Joi.object({
  clientId: Joi.number().integer().required(),
  serviceId: Joi.number().integer().allow(null),
  staffId: Joi.number().integer().allow(null),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow('', null).optional(),
});

export const validateReview = (data) => reviewSchema.validate(data, { abortEarly: false });
