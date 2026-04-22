import express from 'express';
import * as appointmentController from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/', appointmentController.createAppointment);
router.get('/:id', appointmentController.getAppointment);
router.get('/', appointmentController.getAppointments);
router.put('/:id', appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);

export default router;