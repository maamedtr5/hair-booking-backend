// src/controllers/slotController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create Slot
export const createSlot = async (req, res) => {
  try {
    const slot = await prisma.slot.create({ data: req.body });
    res.json(slot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all Slots
export const getSlots = async (req, res) => {
  const slots = await prisma.slot.findMany({ include: { appointment: true } });
  res.json(slots);
};

// Get Slot by ID
export const getSlotById = async (req, res) => {
  const slot = await prisma.slot.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { appointment: true }
  });
  slot ? res.json(slot) : res.status(404).json({ error: 'Slot not found' });
};

// Update Slot
export const updateSlot = async (req, res) => {
  try {
    const slot = await prisma.slot.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(slot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Slot
export const deleteSlot = async (req, res) => {
  try {
    await prisma.slot.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Slot deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
