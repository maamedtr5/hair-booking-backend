// src/routes/appointmentRoutes.js
import express from 'express';
import * as appointmentController from '../controllers/appointmentController.js';
import { authenticate } from '../auth/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public: create a new appointment
router.post('/', appointmentController.createAppointment);

// Public: get a single appointment by ID
router.get('/:id', authenticate, appointmentController.getAppointment);

// Public: get all appointments
router.get('/', authenticate, appointmentController.getAppointments);

// Admin/Staff only: update, delete, reschedule, bulk cancel
router.put('/:id', authenticate, requireRole(['admin','staff']), appointmentController.updateAppointment);
router.delete('/:id', authenticate, requireRole(['admin','staff']), appointmentController.deleteAppointment);
router.put('/:id/reschedule', authenticate, requireRole(['admin','staff']), appointmentController.rescheduleAppointment);
router.post('/bulk/cancel', authenticate, requireRole(['admin','staff']), appointmentController.bulkCancelAppointments);

// Filters
router.get('/client/:clientId', authenticate, appointmentController.getAppointmentsByClient);
router.get('/staff/:staffId', authenticate, requireRole(['admin','staff']), appointmentController.getAppointmentsByStaff);
router.get('/date/:date', authenticate, requireRole(['admin','staff']), appointmentController.getAppointmentsByDate);
router.get('/status/:status', authenticate, requireRole(['admin','staff']), appointmentController.getAppointmentsByStatus);

export default router;
