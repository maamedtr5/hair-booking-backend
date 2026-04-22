// controllers/waitlistController.js
import {
  addToWaitlist,
  getWaitlistEntryById,
  getAllWaitlistEntries,
  updateWaitlistEntry,
  deleteWaitlistEntry
} from '../models/waitlist.js';

export const addToWaitlistHandler = async (req, res) => {
  try {
    const entry = await addToWaitlist(req.body);
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getWaitlistEntryHandler = async (req, res) => {
  try {
    const entry = await getWaitlistEntryById(parseInt(req.params.id));
    if (!entry) return res.status(404).json({ error: "Waitlist entry not found" });
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getWaitlistEntriesHandler = async (req, res) => {
  try {
    const entries = await getAllWaitlistEntries();
    res.json(entries);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateWaitlistEntryHandler = async (req, res) => {
  try {
    const entry = await updateWaitlistEntry(parseInt(req.params.id), req.body);
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteWaitlistEntryHandler = async (req, res) => {
  try {
    await deleteWaitlistEntry(parseInt(req.params.id));
    res.json({ message: "Waitlist entry deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};