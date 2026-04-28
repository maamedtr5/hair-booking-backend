// ES Module User controller
import { prisma } from '../lib/prisma.js';
import {
  createUser,
  getUserById,
  getUserByEmail,
  getAllUsers,
  updateUser,
  deleteUser
} from '../models/user.js';

export async function createUserHandler(req, res) {
  try {
    const user = await createUser(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getUserHandler(req, res) {
  try {
    const user = await getUserById(parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getUsersHandler(req, res) {
  try {
    res.json(await getAllUsers());
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateUserHandler(req, res) {
  try {
    const user = await updateUser(parseInt(req.params.id), req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteUserHandler(req, res) {
  try {
    await deleteUser(parseInt(req.params.id));
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
