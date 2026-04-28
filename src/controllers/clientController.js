// controllers/clientController.js
import { prisma } from '../lib/prisma.js';
import clientModel from '../models/client.js';

export const createClient = async (req, res) => {
  try {
    const client = await clientModel.createClient(req.body);
    res.json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getClient = async (req, res) => {
  try {
    const client = await clientModel.getClientById(parseInt(req.params.id));
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getClients = async (req, res) => {
  try {
    const clients = await clientModel.getAllClients();
    res.json(clients);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const client = await clientModel.updateClient(parseInt(req.params.id), req.body);
    res.json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    await clientModel.deleteClient(parseInt(req.params.id));
    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};