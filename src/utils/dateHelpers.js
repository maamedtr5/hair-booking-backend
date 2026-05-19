// utils/dateHelpers.js
import moment from 'moment-timezone';

// Default timezone (from .env or fallback)
const DEFAULT_TIMEZONE = process.env.TIMEZONE || 'Africa/Accra';

/**
 * Format a date into human-readable string
 * e.g. "May 19th 2026, 11:00 AM"
 */
export const formatDateTime = (date) => {
  return moment(date).tz(DEFAULT_TIMEZONE).format('MMMM Do YYYY, h:mm A');
};

/**
 * Convert a date to ISO string in default timezone
 */
export const toISODateTime = (date) => {
  return moment(date).tz(DEFAULT_TIMEZONE).toISOString();
};

/**
 * Check if a date is in the future
 */
export const isFutureDate = (date) => {
  return moment(date).isAfter(moment());
};

/**
 * Add hours to a date
 */
export const addHours = (date, hours) => {
  return moment(date).add(hours, 'hours').toDate();
};

/**
 * Get start and end of day for filtering appointments
 */
export const getDayRange = (date) => {
  const start = moment(date).tz(DEFAULT_TIMEZONE).startOf('day').toDate();
  const end = moment(date).tz(DEFAULT_TIMEZONE).endOf('day').toDate();
  return { start, end };
};

/**
 * Calculate duration between two dates in minutes
 */
export const getDurationMinutes = (startDate, endDate) => {
  return moment(endDate).diff(moment(startDate), 'minutes');
};
