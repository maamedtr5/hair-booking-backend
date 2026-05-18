// src/validators/appointmentValidator.js
import Joi from 'joi';

// Validation schema for creating/updating an appointment
export const appointmentSchema = Joi.object({
  serviceId: Joi.number().integer().required(),
  staffId: Joi.number().integer().allow(null),
  date: Joi.date().iso().required(),
  status: Joi.string()
    .valid('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')
    .optional(),
  notes: Joi.string().allow('', null).optional(),
  // Optional reminder fields – they are managed internally but can be supplied in tests
  reminderScheduled: Joi.boolean().optional(),
  reminderSent: Joi.boolean().optional(),
  reminderSentAt: Joi.date().iso().allow(null).optional(),
  googleEventId: Joi.string().allow(null).optional(),
});

export const validateAppointment = (data) => appointmentSchema.validate(data, { abortEarly: false });
