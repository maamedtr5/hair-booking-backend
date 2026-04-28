// src/routes/userRoutes.js
import express from 'express';
import {
  createUserHandler,
  getUserHandler,
  getUsersHandler,
  updateUserHandler,
  deleteUserHandler
} from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUserHandler);
router.get('/:id', getUserHandler);
router.get('/', getUsersHandler);
router.put('/:id', updateUserHandler);
router.delete('/:id', deleteUserHandler);

export default router;