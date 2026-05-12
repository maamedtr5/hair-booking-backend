// config/env.js
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

// Validate required variables
const required = ['PORT', 'DATABASE_URL', 'JWT_SECRET', 'PAYSTACK_SECRET'];
required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

// Export config object
export const env = {
  port: process.env.PORT,
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  paystackSecret: process.env.PAYSTACK_SECRET,
};
