import express from 'express';
import * as paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.post('/', paymentController.createPayment);
router.get('/:id', paymentController.getPayment);
router.get('/', paymentController.getPayments);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);

export default router;