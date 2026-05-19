// src/routes/appointmentRoutes.js
import express from 'express';
import * as appointmentController from '../controllers/appointmentController.js';
import { authenticate } from '../auth/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { 
  scheduleAppointmentReminder, 
} from '../jobs/reminderJobs.js';
import { 
  syncAppointmentToStaffCalendar,
  deleteCalendarEvent,
  updateCalendarEvent
} from '../services/googleCalendarService.js';
import pkg from '@prisma/client';
import { 
  validateAppointmentCreate, 
  validateAppointmentUpdate,
  validateBulkCancel 
} from '../validators/appointmentValidator.js';

const { PrismaClient } = pkg;

const router = express.Router();
const prisma = new PrismaClient();

//  CREATE APPOINTMENT
// Public: create a new appointment  
router.post('/',  validateAppointmentCreate, async (req, res) => {
  try {
    // Create appointment via controller
    const appointment = await appointmentController.createAppointment(req, res);
    
    // If appointment was created successfully
    if (appointment && appointment.id) {
      // Schedule reminder email/SMS (24 hours before)
      try {
        await scheduleAppointmentReminder(appointment.id);
        console.log(`✅ Reminder scheduled for appointment ${appointment.id}`);
      } catch (reminderError) {
        console.error('⚠️ Failed to schedule reminder:', reminderError.message);
        // Don't fail the appointment creation if reminder scheduling fails
      }

      // Sync to staff's Google Calendar
      try {
        const calendarResult = await syncAppointmentToStaffCalendar(appointment.id);
        console.log(`📅 Synced to Google Calendar: ${calendarResult.eventId}`);
      } catch (calendarError) {
        console.warn('⚠️ Could not sync to Google Calendar:', calendarError.message);
        // Don't fail the appointment creation if calendar sync fails
      }
    }
  } catch (error) {
    console.error('Error creating appointment:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to create appointment',
        error: error.message 
      });
    }
  }
});

// ==================== GET APPOINTMENTS ====================
// Public: get a single appointment by ID
router.get('/:id', authenticate, appointmentController.getAppointment);

// Public: get all appointments
router.get('/', authenticate, appointmentController.getAppointments);

// ==================== UPDATE APPOINTMENT ====================
// Admin/Staff only: update appointment
router.put('/:id', authenticate, requireRole(['admin','staff']), validateAppointmentUpdate, async (req, res) => {
  try {
    const appointmentId = req.params.id;

    // Get the existing appointment
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: parseInt(appointmentId) },
      include: {
        service: true,
        staff: true,
      },
    });

    if (!existingAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Update appointment via controller
    const updatedAppointment = await appointmentController.updateAppointment(req, res);

    if (updatedAppointment && updatedAppointment.id) {
      // If appointment was cancelled, cancel reminder and delete calendar event
      if (req.body.status === 'CANCELLED') {
        try {
          await cancelAppointmentReminder(appointmentId);
          console.log(`🗑️ Reminder cancelled for appointment ${appointmentId}`);
        } catch (error) {
          console.error('⚠️ Failed to cancel reminder:', error.message);
        }

        // Delete from Google Calendar
        if (existingAppointment.googleEventId) {
          try {
            const staffUserId = existingAppointment.staff?.userId || existingAppointment.staffId;
            await deleteCalendarEvent(staffUserId, existingAppointment.googleEventId);
            console.log(`📅 Deleted from Google Calendar: ${existingAppointment.googleEventId}`);
          } catch (error) {
            console.error('⚠️ Failed to delete from Google Calendar:', error.message);
          }
        }
      }
      // If date/time changed, update calendar event
      else if (req.body.date && req.body.date !== existingAppointment.date) {
        // Reschedule reminder
        try {
          await cancelAppointmentReminder(appointmentId);
          await scheduleAppointmentReminder(appointmentId);
          console.log(`⏰ Reminder rescheduled for appointment ${appointmentId}`);
        } catch (error) {
          console.error('⚠️ Failed to reschedule reminder:', error.message);
        }

        // Update Google Calendar event
        if (existingAppointment.googleEventId) {
          try {
            const staffUserId = existingAppointment.staff?.userId || existingAppointment.staffId;
            const startTime = new Date(req.body.date);
            const endTime = new Date(startTime.getTime() + (existingAppointment.service?.duration || 60) * 60000);

            await updateCalendarEvent(staffUserId, existingAppointment.googleEventId, {
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
            });
            console.log(`📅 Updated Google Calendar event: ${existingAppointment.googleEventId}`);
          } catch (error) {
            console.error('⚠️ Failed to update Google Calendar:', error.message);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error updating appointment:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to update appointment',
        error: error.message,
      });
    }
  }
});

// ==================== DELETE APPOINTMENT ====================
// Admin/Staff only: delete appointment
router.delete('/:id', authenticate, requireRole(['admin','staff']), async (req, res) => {
  try {
    const appointmentId = req.params.id;

    // Get appointment details before deletion
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(appointmentId) },
      include: { staff: true },
    });

    if (appointment) {
      // Cancel reminder
      try {
        await cancelAppointmentReminder(appointmentId);
        console.log(`🗑️ Reminder cancelled for appointment ${appointmentId}`);
      } catch (error) {
        console.error('⚠️ Failed to cancel reminder:', error.message);
      }

      // Delete from Google Calendar
      if (appointment.googleEventId) {
        try {
          const staffUserId = appointment.staff?.userId || appointment.staffId;
          await deleteCalendarEvent(staffUserId, appointment.googleEventId);
          console.log(`📅 Deleted from Google Calendar: ${appointment.googleEventId}`);
        } catch (error) {
          console.error('⚠️ Failed to delete from Google Calendar:', error.message);
        }
      }
    }

    // Delete appointment via controller
    await appointmentController.deleteAppointment(req, res);
  } catch (error) {
    console.error('Error deleting appointment:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete appointment',
        error: error.message,
      });
    }
  }
});

// ==================== RESCHEDULE APPOINTMENT ====================
// Admin/Staff only: reschedule appointment
router.put('/:id/reschedule', authenticate, requireRole(['admin','staff']), async (req, res) => {
  try {
    const appointmentId = req.params.id;

    // Get existing appointment
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: parseInt(appointmentId) },
      include: {
        service: true,
        staff: true,
      },
    });

    if (!existingAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Reschedule via controller
    const rescheduledAppointment = await appointmentController.rescheduleAppointment(req, res);

    if (rescheduledAppointment) {
      // Cancel old reminder
      try {
        await cancelAppointmentReminder(appointmentId);
      } catch (error) {
        console.error('⚠️ Failed to cancel old reminder:', error.message);
      }

      // Schedule new reminder
      try {
        await scheduleAppointmentReminder(appointmentId);
        console.log(`⏰ New reminder scheduled for appointment ${appointmentId}`);
      } catch (error) {
        console.error('⚠️ Failed to schedule new reminder:', error.message);
      }

      // Update Google Calendar
      if (existingAppointment.googleEventId) {
        try {
          const staffUserId = existingAppointment.staff?.userId || existingAppointment.staffId;
          const startTime = new Date(req.body.newDate || req.body.date);
          const endTime = new Date(startTime.getTime() + (existingAppointment.service?.duration || 60) * 60000);

          await updateCalendarEvent(staffUserId, existingAppointment.googleEventId, {
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          });
          console.log(`📅 Updated Google Calendar event: ${existingAppointment.googleEventId}`);
        } catch (error) {
          console.error('⚠️ Failed to update Google Calendar:', error.message);
        }
      }
    }
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to reschedule appointment',
        error: error.message,
      });
    }
  }
});

// ==================== BULK CANCEL APPOINTMENTS ====================
// Admin/Staff only: bulk cancel appointments
router.post('/bulk/cancel', authenticate, requireRole(['admin','staff']), validateBulkCancel, async (req, res) => {
  try {
    const { appointmentIds } = req.body;

    if (!appointmentIds || !Array.isArray(appointmentIds)) {
      return res.status(400).json({
        success: false,
        message: 'appointmentIds array is required',
      });
    }

    // Get all appointments before cancelling
    const appointments = await prisma.appointment.findMany({
      where: {
        id: {
          in: appointmentIds.map(id => parseInt(id)),
        },
      },
      include: { staff: true },
    });

    // Cancel reminders and calendar events for each
    for (const appointment of appointments) {
      try {
        await cancelAppointmentReminder(appointment.id.toString());
      } catch (error) {
        console.error(`⚠️ Failed to cancel reminder for ${appointment.id}:`, error.message);
      }

      if (appointment.googleEventId) {
        try {
          const staffUserId = appointment.staff?.userId || appointment.staffId;
          await deleteCalendarEvent(staffUserId, appointment.googleEventId);
        } catch (error) {
          console.error(`⚠️ Failed to delete calendar event for ${appointment.id}:`, error.message);
        }
      }
    }

    // Bulk cancel via controller
    await appointmentController.bulkCancelAppointments(req, res);
  } catch (error) {
    console.error('Error bulk cancelling appointments:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to bulk cancel appointments',
        error: error.message,
      });
    }
  }
});

// ==================== FILTERS ====================
router.get('/client/:clientId', authenticate, appointmentController.getAppointmentsByClient);
router.get('/staff/:staffId', authenticate, requireRole(['admin','staff']), appointmentController.getAppointmentsByStaff);
router.get('/date/:date', authenticate, requireRole(['admin','staff']), appointmentController.getAppointmentsByDate);
router.get('/status/:status', authenticate, requireRole(['admin','staff']), appointmentController.getAppointmentsByStatus);

// ==================== GOOGLE CALENDAR SYNC ====================
// Manual sync appointment to Google Calendar
router.post('/:id/sync-calendar', authenticate, requireRole(['admin','staff']), async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const result = await syncAppointmentToStaffCalendar(appointmentId);

    res.json({
      success: true,
      message: 'Appointment synced to Google Calendar',
      eventId: result.eventId,
      eventLink: result.eventLink,
    });
  } catch (error) {
    console.error('Error syncing to calendar:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync to Google Calendar',
      error: error.message,
    });
  }
});

// Remove appointment from Google Calendar
router.delete('/:id/calendar-event', authenticate, requireRole(['admin','staff']), async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(appointmentId) },
      include: { staff: true },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    if (!appointment.googleEventId) {
      return res.status(400).json({
        success: false,
        message: 'No Google Calendar event associated with this appointment',
      });
    }

    const staffUserId = appointment.staff?.userId || appointment.staffId;
    await deleteCalendarEvent(staffUserId, appointment.googleEventId);

    // Update appointment to remove eventId
    await prisma.appointment.update({
      where: { id: parseInt(appointmentId) },
      data: { googleEventId: null },
    });

    res.json({
      success: true,
      message: 'Event removed from Google Calendar',
    });
  } catch (error) {
    console.error('Error removing calendar event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from Google Calendar',
      error: error.message,
    });
  }
});

// ==================== REMINDER MANAGEMENT ====================
// Manually trigger reminder for an appointment
router.post('/:id/send-reminder', authenticate, requireRole(['admin','staff']), async (req, res) => {
  try {
    const appointmentId = req.params.id;

    await scheduleAppointmentReminder(appointmentId);

    res.json({
      success: true,
      message: 'Reminder scheduled successfully',
    });
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule reminder',
      error: error.message,
    });
  }
});

// Cancel scheduled reminder
router.delete('/:id/reminder', authenticate, requireRole(['admin','staff']), async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const result = await cancelAppointmentReminder(appointmentId);

    res.json({
      success: true,
      message: 'Reminder cancelled successfully',
      cancelled: result.cancelled,
    });
  } catch (error) {
    console.error('Error cancelling reminder:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel reminder',
      error: error.message,
    });
  }
});

export default router;