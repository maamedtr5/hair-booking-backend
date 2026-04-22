import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Revenue report
export async function getRevenueReportHandler(req, res) {
  try {
    const payments = await prisma.payment.findMany({ where: { status: 'SUCCESS' } });
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    res.json({ totalRevenue, count: payments.length });
  } catch (err) { res.status(400).json({ error: err.message }); }
}

// Top services report
export async function getTopServicesReportHandler(req, res) {
  try {
    const services = await prisma.service.findMany({ include: { appointments: true } });
    const ranked = services.map(s => ({ name: s.name, count: s.appointments.length }))
                           .sort((a, b) => b.count - a.count);
    res.json(ranked);
  } catch (err) { res.status(400).json({ error: err.message }); }
}
