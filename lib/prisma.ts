import { PrismaClient } from '@prisma/client';

// Prevents exhausting DB connections from hot-reloaded module instances
// in development (Next.js re-evaluates modules on every change).
declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma = global.__prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}
