// src/controllers/waitlistController.js
import { prisma } from '../lib/prisma.js';
import {
  addToWaitlist,
  getWaitlistById,
  getAllWaitlists,
  updateWaitlist,
  deleteWaitlistEntry
} from '../models/waitlist.js';

export async function addToWaitlistHandler(req, res) {
  try {
    const waitlist = await addToWaitlist(req.body);
    res.json(waitlist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getWaitlistEntryHandler(req, res) {
  try {
    const waitlist = await getWaitlistById(req.params.id);
    if (!waitlist) return res.status(404).json({ error: 'Entry not found' });
    res.json(waitlist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getWaitlistEntriesHandler(req, res) {
  try {
    const waitlists = await getAllWaitlists();
    res.json(waitlists);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateWaitlistEntryHandler(req, res) {
  try {
    const waitlist = await updateWaitlist(req.params.id, req.body);
    res.json(waitlist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteWaitlistEntryHandler(req, res) {
  try {
    await deleteWaitlistEntry(req.params.id);
    res.json({ message: 'Entry deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}