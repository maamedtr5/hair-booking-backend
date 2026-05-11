import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getNotificationsHandler = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: parseInt(req.params.userId) },
      orderBy: { createdAt: 'desc' }
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createNotificationHandler = async (req, res) => {
  try {
    const { userId, message, type } = req.body;

    const notification = await prisma.notification.create({
      data: {
        userId: parseInt(userId), // 👈 convert string to Int
        message,
        type
      }
    });

    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const bulkMarkAsReadHandler = async (req, res) => {
  try {
    const { ids } = req.body;
    await prisma.notification.updateMany({
      where: { id: { in: ids } },
      data: { read: true }
    });
    res.json({ message: 'Notifications marked as read' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const markAllAsReadHandler = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    await prisma.notification.updateMany({
      where: { userId },
      data: { read: true }
    });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
