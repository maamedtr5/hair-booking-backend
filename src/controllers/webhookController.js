import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Paystack webhook
export const paystackWebhook = async (req, res) => {
  try {
    const event = req.body;

    // Verify signature
    const crypto = await import('crypto');
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET)
                       .update(JSON.stringify(req.body))
                       .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Update payment status
    await prisma.payment.update({
      where: { transactionRef: event.data.reference },
      data: {
        status: event.event === 'charge.success' ? 'SUCCESS' : 'FAILED',
        externalId: event.data.id,
        metadata: event.data
      }
    });

    res.sendStatus(200);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

