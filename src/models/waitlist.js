// models/waitlist.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function addToWaitlist(data) {
  return prisma.waitlist.create({ data });
}

export async function getWaitlistEntryById(id) {
  return prisma.waitlist.findUnique({
    where: { id },
    include: { client: true, service: true }
  });
}

export async function getAllWaitlistEntries() {
  return prisma