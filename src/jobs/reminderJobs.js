// jobs/reminderJobs.js
import cron from 'node-cron';
import moment from 'moment';
import { sendEmail } from '../services/emailService.js';
import { sendAppointmentReminderSMS } from '../services/smsService.js';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

/**
 * Daily job to send reminders for upcoming appointments
 * Runs every day at 9 AM (Africa/Accra timezone)
 */
export const scheduleDailyReminders = () => {
  cron.schedule('0 9 * * *', async () => {
    try {
      console.log('🔄 Running daily reminder scheduler...');
      // ... your existing reminder logic here ...
    } catch (error) {
      console.error('❌ Error in daily reminder scheduler:', error);
    }
  }, {
    scheduled: true,
    timezone: 'Africa/Accra',
  });
};

/**
 * Schedule a reminder for a specific appointment
 * @param {string} appointmentId - ID of the appointment
 * @param {string} cronExpression - Cron string for when to send reminder
 * @returns {object} task - The cron task created
 */
export const scheduleAppointmentReminder = async (appointmentId, cronExpression) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        client: { include: { user: true } },
        service: true,
        staff: true,
      },
    });

    if (!appointment) {
      throw new Error(`Appointment ${appointmentId} not found`);
    }

    const task = cron.schedule(cronExpression, async () => {
      const formattedTime = moment(appointment.appointmentDateTime || appointment.appointmentDate)
        .format('MMMM Do YYYY, h:mm A');

      const reminderData = {
        clientName: appointment.client?.user?.name || `${appointment.client?.firstName} ${appointment.client?.lastName}`,
        serviceName: appointment.service?.name || 'Your service',
        staffName: appointment.staff?.name || `${appointment.staff?.firstName} ${appointment.staff?.lastName}`,
        appointmentTime: formattedTime,
        appointmentId: appointment.id,
      };

      if (appointment.client?.user?.email || appointment.client?.email) {
        await sendEmail({
          to: appointment.client.user?.email || appointment.client.email,
          template: 'appointmentReminder',
          data: reminderData,
        });
      }

      if (appointment.client?.user?.phone || appointment.client?.phone) {
        await sendAppointmentReminderSMS({
          ...reminderData,
          clientPhone: appointment.client.user?.phone || appointment.client.phone,
        });
      }
    });

    console.log(`✅ Reminder scheduled for appointment ${appointmentId}`);
    return task;
  } catch (error) {
    console.error('❌ Error scheduling appointment reminder:', error);
  }
};

/**
 * Cancel a scheduled reminder
 * @param {object} task - The cron task to cancel
 */
export const cancelAppointmentReminder = (task) => {
  try {
    task.stop();
    console.log('✅ Appointment reminder cancelled');
  } catch (error) {
    console.error('❌ Error cancelling appointment reminder:', error);
  }
};

export const getQueueStats = async () => {
  return {
    jobs: [
      { name: 'dailyReminders', schedule: '0 9 * * *', status: 'scheduled' }
    ]
  };
  req.isInternalUpdate = true;
};
