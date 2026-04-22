// models/booking.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function createBooking(data) {
  return prisma.booking.create({ data });
}

async function getBookingById(id) {
  return prisma.booking.findUnique({
    where: { id },
    include: { appointment: true, client: true, payment: true }
  });
}

async function getAllBookings() {
  return prisma.booking.findMany({
    include: { appointment: true, client: true, payment: true }
  });
}

async function updateBooking(id, data) {
  return prisma.booking.update({
    where: { id },
    data
  });
}

async function deleteBooking(id) {
  return prisma.booking.delete({ where: { id } });
}

  export default {
  createBooking,
  getBookingById,
  getAllBookings,
  updateBooking,
  deleteBooking
};
