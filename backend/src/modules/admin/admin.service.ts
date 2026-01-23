/**
 * Nova Player - Admin Service
 */
import { prisma } from '../../config/database';
import { generateAdminToken } from '../../config/jwt';
import { ApiError } from '../../middlewares/errorHandler';
import { comparePassword, hashPassword } from '../../utils/helpers';
import { ERROR_MESSAGES, ADMIN_TYPE } from '../../utils/constants';

export async function loginAdmin(email: string, password: string) {
  const admin = await prisma.adminUser.findFirst({
    where: { email, adminType: ADMIN_TYPE.TECH, isActive: true },
  });
  if (!admin) throw ApiError.unauthorized(ERROR_MESSAGES.INVALID_CREDENTIALS);
  
  const valid = await comparePassword(password, admin.passwordHash);
  if (!valid) throw ApiError.unauthorized(ERROR_MESSAGES.INVALID_CREDENTIALS);
  
  await prisma.adminUser.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
  
  const token = generateAdminToken({ id: admin.id, email: admin.email, role: admin.role });
  return { admin: { id: admin.id, email: admin.email, role: admin.role }, token };
}

export async function createAdminUser(email: string, password: string, role: string, adminType: string) {
  const passwordHash = await hashPassword(password);
  return prisma.adminUser.create({
    data: { email, passwordHash, role: role as never, adminType: adminType as never },
  });
}

export async function getStats() {
  const [devices, resellers, licenses, payments] = await Promise.all([
    prisma.device.groupBy({ by: ['status'], _count: true }),
    prisma.reseller.count(),
    prisma.license.groupBy({ by: ['status'], _count: true }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } }),
  ]);
  return { devices, resellers, licenses, totalRevenue: payments._sum.amount || 0 };
}
