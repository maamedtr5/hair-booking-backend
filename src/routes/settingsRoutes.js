import express from 'express';
import * as settingsController from '../controllers/settingsController.js';

const router = express.Router();

router.post('/', settingsController.createSetting);
router.get('/:id', settingsController.getSetting);
router.get('/key/:key', settingsController.getSettingByKey);
router.get('/', settingsController.getSettings);
router.put('/:id', settingsController.updateSetting);
router.delete('/:id', settingsController.deleteSetting);

export default router;