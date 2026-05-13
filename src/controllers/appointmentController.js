// controllers/appointmentController.js
import { prisma } from '../lib/prisma.js';
import appointmentModel from '../models/appointment.js';
import { sendEmail } from '../services/emailService.js';
import { sendAppointmentReminderSMS } from '../services/smsService.js';

// ✅ Create appointment
export const createAppointment = async (req, res) => {
  try {
    const appointment = await appointmentModel.createAppointment(req.body);

    // Confirmation email
    if (appointment.client?.email) {
      await sendEmail({
        to: appointment.client.email,
        template: 'appointmentConfirmation',
        data: {
          clientName: appointment.client.name || `${appointment.client.firstName} ${appointment.client.lastName}`,
          serviceName: appointment.service?.name,
          appointmentTime: appointment.date || appointment.appointmentDateTime,
          staffName: appointment.staff?.name,
        },
      });
    }

    // Confirmation SMS
    if (appointment.client?.phone) {
      await sendAppointmentReminderSMS({
        clientPhone: appointment.client.phone,
        clientName: appointment.client.name,
        serviceName: appointment.service?.name,
        appointmentTime: appointment.date || appointment.appointmentDateTime,
        staffName: appointment.staff?.name,
      });
    }

    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get single appointment by ID
export const getAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
      include: { client: true, staff: true, service: true },
    });
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get all appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { client: true, staff: true, service: true },
    });
    res.json(appointments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Update appointment
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: req.body,
      include: { client: true, staff: true, service: true },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete appointment
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.appointment.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get appointments by client ID
export const getAppointmentsByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const appointments = await prisma.appointment.findMany({
      where: { clientId: parseInt(clientId) },
      include: { client: true, staff: true, service: true },
    });
    res.json(appointments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get appointments by staff ID
export const getAppointmentsByStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const appointments = await prisma.appointment.findMany({
      where: { staffId: parseInt(staffId) },
      include: { client: true, staff: true, service: true },
    });
    res.json(appointments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get appointments by date
export const getAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const appointments = await prisma.appointment.findMany({
      where: { date: new Date(date) },
      include: { client: true, staff: true, service: true },
    });
    res.json(appointments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get appointments by status
export const getAppointmentsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const appointments = await prisma.appointment.findMany({
      where: { status: status.toUpperCase() },
      include: { client: true, staff: true, service: true },
    });
    res.json(appointments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Bulk cancel appointments (with notifications)
export const bulkCancelAppointments = async (req, res) => {
  try {
    const { ids } = req.body;
    const cancelledAppointments = await prisma.appointment.findMany({
      where: { id: { in: ids } },
      include: { client: true, staff: true, service: true },
    });

    await prisma.appointment.updateMany({
      where: { id: { in: ids } },
      data: { status: 'CANCELLED' },
    });

    for (const appt of cancelledAppointments) {
      if (appt.client?.email) {
        await sendEmail({
          to: appt.client.email,
          template: 'appointmentCancelled',
          data: {
            clientName: appt.client.name,
            serviceName: appt.service?.name,
            appointmentTime: appt.date,
            staffName: appt.staff?.name,
          },
        });
      }
      if (appt.client?.phone) {
        await sendAppointmentReminderSMS({
          clientPhone: appt.client.phone,
          clientName: appt.client.name,
          serviceName: appt.service?.name,
          appointmentTime: appt.date,
          staffName: appt.staff?.name,
        });
      }
    }

    res.json({ message: 'Appointments cancelled and clients notified', count: ids.length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Reschedule appointment (with notifications)
export const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { newDate } = req.body;

    const updated = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { date: new Date(newDate), status: 'RESCHEDULED' },
      include: { client: true, staff: true, service: true },
    });

    if (updated.client?.email) {
      await sendEmail({
        to: updated.client.email,
        template: 'appointmentRescheduled',
        data: {
          clientName: updated.client.name,
          serviceName: updated.service?.name,
          appointmentTime: updated.date,
          staffName: updated.staff?.name,
        },
      });
    }
    if (updated.client?.phone) {
      await sendAppointmentReminderSMS({
        clientPhone: updated.client.phone,
        clientName: updated.client.name,
        serviceName: updated.service?.name,
        appointmentTime: updated.date,
        staffName: updated.staff?.name,
      });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
