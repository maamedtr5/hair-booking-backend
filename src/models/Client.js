// models/client.js
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();


async function createClient(data) {
  return prisma.client.create({ data });
}

async function getClientById(id) {
  return prisma.client.findUnique({
    where: { id },
    include: { user: true, bookings: true }
  });
}

async function getAllClients() {
  return prisma.client.findMany({ include: { user: true } });
}

async function updateClient(id, data) {
  return prisma.client.update({
    where: { id },
    data
  });
}

async function deleteClient(id) {
  return prisma.client.delete({ where: { id } });
}

  export default {
  createClient,
  getClientById,
  getAllClients,
  updateClient,
  deleteClient
};
