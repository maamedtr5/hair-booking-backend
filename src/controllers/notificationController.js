import { prisma } from '../lib/prisma.js';
import { createNotification, getNotificationById, getUserNotifications, markNotificationRead, deleteNotification } from '../models/notifications.js';

export async function createNotificationHandler(req, res) { try { res.json(await createNotification(req.body)); } catch (err) { res.status(400).json({ error: err.message }); } }
export async function getNotificationHandler(req, res) { try { const n = await getNotificationById(parseInt(req.params.id)); if (!n) return res.status(404).json({ error: "Notification not found" }); res.json(n); } catch (err) { res.status(400).json({ error: err.message }); } }
export async function getUserNotificationsHandler(req, res) { try { res.json(await getUserNotifications(parseInt(req.params.userId))); } catch (err) { res.status(400).json({ error: err.message }); } }
export async function markNotificationReadHandler(req, res) { try { res.json(await markNotificationRead(parseInt(req.params.id))); } catch (err) { res.status(400).json({ error: err.message }); } }
export async function deleteNotificationHandler(req, res) { try { await deleteNotification(parseInt(req.params.id)); res.json({ message: "Notification deleted successfully" }); } catch (err) { res.status(400).json({ error: err.message }); } }
