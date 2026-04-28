
// controllers/paymentController.js
import { prisma } from '../lib/prisma.js';
import paymentModel from '../models/payment.js';

export const createPayment = async (req, res) => {
  try {
    const payment = await paymentModel.createPayment(req.body);
    res.json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getPayment = async (req, res) => {
  try {
    const payment = await paymentModel.getPaymentById(parseInt(req.params.id));
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = await paymentModel.getAllPayments();
    res.json(payments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const payment = await paymentModel.updatePayment(parseInt(req.params.id), req.body);
    res.json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deletePayment = async (req, res) => {
  try {
    await paymentModel.deletePayment(parseInt(req.params.id));
    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};