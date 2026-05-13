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

      // Calculate time window (appointments happening 23–25 hours from now)
      const now = new Date();
      const reminderStartTime = moment(now).add(23, 'hours').toDate();
      const reminderEndTime = moment(now).add(25, 'hours').toDate();

      console.log(`📅 Looking for appointments between ${moment(reminderStartTime).format('YYYY-MM-DD HH:mm')} and ${moment(reminderEndTime).format('YYYY-MM-DD HH:mm')}`);

      // Fetch appointments scheduled for tomorrow
      const appointments = await prisma.appointment.findMany({
        where: {
          OR: [
            { appointmentDateTime: { gte: reminderStartTime, lte: reminderEndTime } },
            { appointmentDate: { gte: reminderStartTime, lte: reminderEndTime } },
          ],
          status: { in: ['confirmed', 'pending', 'scheduled'] },
          reminderSent: false,
        },
        include: {
          client: { include: { user: true } },
          service: true,
          staff: true,
        },
      });

      console.log(`📅 Found ${appointments.length} appointments requiring reminders`);

      for (const appointment of appointments) {
        const appointmentDate = new Date(appointment.appointmentDateTime || appointment.appointmentDate);
        const formattedTime = moment(appointmentDate).format('MMMM Do YYYY, h:mm A');

        const reminderData = {
          clientName: appointment.client?.user?.name || `${appointment.client?.firstName} ${appointment.client?.lastName}`,
          serviceName: appointment.service?.name || 'Your service',
          staffName: appointment.staff?.name || `${appointment.staff?.firstName} ${appointment.staff?.lastName}`,
          appointmentTime: formattedTime,
          appointmentId: appointment.id,
          duration: appointment.service?.duration,
          price: appointment.service?.price,
        };

        // Send email
        if (appointment.client?.user?.email || appointment.client?.email) {
          try {
            await sendEmail({
              to: appointment.client.user?.email || appointment.client.email,
              template: 'appointmentReminder',
              data: reminderData,
            });
            console.log(`✅ Email sent to ${appointment.client.user?.email || appointment.client.email}`);
          } catch (err) {
            console.error(`❌ Failed to send email:`, err.message);
          }
        }

        // Send SMS
        if (appointment.client?.user?.phone || appointment.client?.phone) {
          try {
            await sendAppointmentReminderSMS({
              ...reminderData,
              clientPhone: appointment.client.user?.phone || appointment.client.phone,
            });
            console.log(`✅ SMS sent to ${appointment.client.user?.phone || appointment.client.phone}`);
          } catch (err) {
            console.error(`❌ Failed to send SMS:`, err.message);
          }
        }

        // Update DB
        await prisma.appointment.update({
          where: { id: appointment.id },
          data: { reminderSent: true, reminderSentAt: new Date() },
        });
      }

      console.log('✅ Daily reminder scheduler completed');
    } catch (error) {
      console.error('❌ Error in daily reminder scheduler:', error);
    }
  }, {
    scheduled: true,
    timezone: 'Africa/Accra',
  });
};

export const getQueueStats = async () => {
  // For now, just return a placeholder
  return {
    jobs: [
      { name: 'dailyReminders', schedule: '0 9 * * *', status: 'scheduled' }
    ]
  };
};
