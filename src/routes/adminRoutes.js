// routes/adminRoutes.js
import express from 'express';
import { createAdminHandler, getAdminHandler, getAdminsHandler, updateAdminHandler, deleteAdminHandler } from '../controllers/adminController.js';

const router = express.Router();

router.post('/', createAdminHandler);
router.get('/:id', getAdminHandler);
router.get('/', getAdminsHandler);
router.put('/:id', updateAdminHandler);
router.delete('/:id', deleteAdminHandler);

export default router;
