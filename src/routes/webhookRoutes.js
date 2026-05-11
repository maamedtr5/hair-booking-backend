import express from 'express';
import { paystackWebhook} from '../controllers/webhookController.js';

const router = express.Router();

router.post('/paystack', express.json({ type: '*/*' }), paystackWebhook);


export default router;
