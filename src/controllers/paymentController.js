import { handlePayment } from '../services/payment/providerService.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const initializePayment = async (req, res) => {
  const { bookingId, amount, method, provider, metadata } = req.body;

  try {
    // Call unified provider service
    const response = await handlePayment(provider, amount, metadata);

    // Save payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount,
        method,
        provider,
        status: 'PENDING',
        transactionRef: response.reference,
        externalId: response.externalId,
        metadata
      }
    });

    res.json({ payment, checkoutUrl: response.checkoutUrl });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin or stylist marks payment as SUCCESS
export const markPaymentSuccess = async (req, res) => {
  try {
    const payment = await prisma.payment.update({
      where: { id: parseInt(req.params.id) },
      data: { status: 'SUCCESS' }
    });
    res.json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin or stylist marks payment as FAILED
export const markPaymentFailed = async (req, res) => {
  try {
    const payment = await prisma.payment.update({
      where: { id: parseInt(req.params.id) },
      data: { status: 'FAILED' }
    });
    res.json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
