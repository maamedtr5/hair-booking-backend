// src/routes/userRoutes.js
import express from 'express';
import {
  createUserHandler,
  getUserHandler,
  getUsersHandler,
  updateUserHandler,
  deleteUserHandler,
  register,
  login
} from '../controllers/userController.js';
import { 
  validateUserRegistration, 
  validateUserLogin, 
  validateUserUpdate 
} from '../validators/userValidator.js';
import { authenticate } from '../auth/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);

// User CRUD routes
router.post('/', createUserHandler);
router.get('/:id', getUserHandler);
router.get('/', getUsersHandler);
router.put('/:id', authenticate, validateUserUpdate, updateUserHandler);
router.delete('/:id', deleteUserHandler);

export default router;
