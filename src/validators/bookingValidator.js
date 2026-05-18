// src/validators/bookingValidator.js
import Joi from 'joi';

export const bookingSchema = Joi.object({
  appointmentId: Joi.number().integer().required(),
  clientId: Joi.number().integer().required(),
  userId: Joi.number().integer().allow(null),
  promocodeId: Joi.number().integer().allow(null),
  status: Joi.string()
    .valid('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')
    .optional(),
});

export const validateBooking = (data) => bookingSchema.validate(data, { abortEarly: false });
