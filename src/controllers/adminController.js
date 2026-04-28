// src/controllers/adminController.js
import { prisma } from '../lib/prisma.js';

export async function createAdminHandler(req, res) {
  try {
    const admin = await prisma.admin.create({ data: req.body });
    res.json(admin);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getAdminHandler(req, res) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { user: true }
    });
    if (!admin) return res.status(404).json({ error: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getAdminsHandler(req, res) {
  try {
    const admins = await prisma.admin.findMany({ include: { user: true } });
    res.json(admins);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateAdminHandler(req, res) {
  try {
    const admin = await prisma.admin.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(admin);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteAdminHandler(req, res) {
  try {
    await prisma.admin.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}