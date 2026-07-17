import 'server-only';
import { prisma } from './prisma';

export async function logAction(username: string | null, action: string, detail?: string, ip?: string | null) {
  try {
    await prisma.auditLog.create({
      data: { username, action, detail: detail ? detail.slice(0, 500) : null, ip: ip || 'unknown' },
    });
  } catch (err) {
    // Audit logging must never break the request it's logging.
    console.error('Audit log write failed:', err);
  }
}

export async function recentAuditLog(limit = 100) {
  return prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: limit });
}
