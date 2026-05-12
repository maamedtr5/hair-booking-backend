// config/constants.js

export const Roles = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  CLIENT: 'CLIENT',
};

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
};

export const Defaults = {
  CURRENCY: 'GHS',
  TIMEZONE: 'Africa/Accra',
  PAGE_LIMIT: 20,
};

export const Services = {
  GOOGLE_CALENDAR: 'GOOGLE_CALENDAR',
  NOTIFICATION_EMAIL: 'EMAIL',
  NOTIFICATION_SMS: 'SMS',
};

export const Jobs = {
  REMINDER: 'REMINDER_JOB',
  CLEANUP: 'CLEANUP_JOB',
};
