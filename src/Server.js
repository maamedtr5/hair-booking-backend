// server.js
import path from 'path'; 
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { env } from './config/env.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { oauth2Client, getAuthUrl, getTokensFromCode } from './services/googleCalendarService.js';

// Import your routes
import adminRoutes from "./routes/adminRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import userRoutes from './routes/userRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import formRoutes from './routes/formRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import promocodeRoutes from './routes/promocodeRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import waitlistRoutes from './routes/waitlistRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import authRoutes from './auth/authRoutes.js';
import slotRoutes from './routes/slotRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

// Jobs & services
import { 
  scheduleDailyReminders, 
   getQueueStats 
} from './jobs/reminderJobs.js';
import { verifyEmailConfig } from './services/emailService.js';
import { verifySMSConfig } from './services/smsService.js';

// Initialize dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const swaggerDocument = YAML.load(
  path.join(process.cwd(), 'docs', 'swagger.yaml')
);

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log('Request body:', req.body);
  next();
});

// Swagger UI 
if (swaggerDocument) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log(`📖 API Documentation available at http://localhost:${PORT}/api-docs`);
}

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Monitoring route for jobs
app.get('/jobs/stats', async (req, res) => {
  try {
    const stats = await getQueueStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/auth/google', (req, res) => {
  const scopes = ['https://www.googleapis.com/auth/calendar'];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  res.redirect(url);
});

app.get('/auth/google', (req, res) => {
  const scopes = ['https://www.googleapis.com/auth/calendar'];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  res.redirect(url);
});

// Mount your existing routes
app.use('/auth', authRoutes);
app.use('/clients', clientRoutes);
app.use('/users', userRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/bookings', bookingRoutes);
app.use('/forms', formRoutes);
app.use('/payments', paymentRoutes);
app.use('/promocodes', promocodeRoutes);
app.use('/reviews', reviewRoutes);
app.use('/services', serviceRoutes);
app.use('/settings', settingsRoutes);
app.use('/waitlist', waitlistRoutes);
app.use('/staff', staffRoutes);
app.use('/admin', adminRoutes);
app.use('/reports', reportRoutes);
app.use('/notifications', notificationRoutes);
app.use('/slots', slotRoutes);
app.use('/webhooks', webhookRoutes);
app.use('/emails', emailRoutes);

// Background jobs initializer
const initializeJobs = async () => {
  try {
    console.log('🚀 Initializing background jobs...');
    
    const emailConfigured = await verifyEmailConfig();
    const smsConfigured = verifySMSConfig();
    
    if (!emailConfigured && !smsConfigured) {
      console.warn('⚠️ Neither email nor SMS is configured. Reminders will not be sent.');
    }
    
    await scheduleDailyReminders();
    console.log('✅ Background jobs initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing background jobs:', error);
  }
};

// Test route
app.get('/staff/hello', (req, res) => {
  res.send('Hello from staff route!');
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  await initializeJobs();
});
