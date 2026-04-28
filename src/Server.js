import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import your routes
import adminRoutes from "./routes/adminRoutes.js";
import staffRoutes from "./routes/staffRoutes.js"
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

// Initialize dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount your existing routes
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


// Add a test route
app.get('/staff/hello', (req, res) => {
  res.send('Hello from staff route!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});