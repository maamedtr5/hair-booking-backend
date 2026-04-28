// src/models/waitlist.js
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export async function addToWaitlist(data) {
  return prisma.waitlist.create({ data });
}

export async function getWaitlistById(id) {
  return prisma.waitlist.findUnique({ where: { id } });
}

export async function getAllWaitlists() {
  return prisma.waitlist.findMany();
}

export async function updateWaitlist(id, data) {
  return prisma.waitlist.update({ where: { id }, data });
}

export async function deleteWaitlistEntry(id) {
  return prisma.waitlist.delete({ where: { id } });
}
