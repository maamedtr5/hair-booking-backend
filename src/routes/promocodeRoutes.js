import express from 'express';
import * as promocodeController from '../controllers/promocodeController.js';

const router = express.Router();

router.post('/', promocodeController.createPromocode);
router.get('/:id', promocodeController.getPromocode);
router.get('/code/:code', promocodeController.getPromocodeByCode);
router.get('/', promocodeController.getPromocodes);
router.put('/:id', promocodeController.updatePromocode);
router.delete('/:id', promocodeController.deletePromocode);

export default router;