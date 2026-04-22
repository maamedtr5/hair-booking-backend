import express from 'express';
import * as formController from '../controllers/formController.js';

const router = express.Router();

router.post('/', formController.createForm);
router.get('/:id', formController.getForm);
router.get('/', formController.getForms);
router.put('/:id', formController.updateForm);
router.delete('/:id', formController.deleteForm);

export default router;