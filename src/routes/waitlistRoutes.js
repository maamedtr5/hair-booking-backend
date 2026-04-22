
// routes/waitlistRoutes.js
import express from 'express';
import {
  addToWaitlistHandler,
  getWaitlistEntryHandler,
  getWaitlistEntriesHandler,
  updateWaitlistEntryHandler,
  deleteWaitlistEntryHandler
} from '../controllers/waitlistController.js';

const router = express.Router();

router.post('/', addToWaitlistHandler);
router.get('/:id', getWaitlistEntryHandler);
router.get('/', getWaitlistEntriesHandler);
router.put('/:id', updateWaitlistEntryHandler);
router.delete('/:id', deleteWaitlistEntryHandler);

export default router;
