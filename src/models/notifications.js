import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createNotification(data) { return prisma.notification.create({ data }); }
export async function getNotificationById(id) { return prisma.notification.findUnique({ where: { id }, include: { user: true } }); }
export async function getUserNotifications(userId) { return prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }); }
export async function markNotificationRead(id) { return prisma.notification.update({ where: { id }, data: { isRead: true } }); }
export async function deleteNotification(id) { return prisma.notification.delete({ where: { id } }); }
