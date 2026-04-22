import express from 'express';
import { createStaffHandler, getStaffHandler, getStaffsHandler, updateStaffHandler, deleteStaffHandler } from '../controllers/staffController.js';

const router = express.Router();
router.post('/', createStaffHandler);
router.get('/:id', getStaffHandler);
router.get('/', getStaffsHandler);
router.put('/:id', updateStaffHandler);
router.delete('/:id', deleteStaffHandler);
export default router;
