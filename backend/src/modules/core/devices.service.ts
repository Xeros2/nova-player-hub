/**
 * Nova Player - Device Service
 * Business logic for device operations
 */

import { prisma } from '../../config/database';
import { generateDeviceToken } from '../../config/jwt';
import { ApiError } from '../../middlewares/errorHandler';
import {
  hashPassword,
  comparePassword,
  calculateTrialExpiration,
  calculateActivationExpiration,
  isExpired,
  getPaginationParams,
  createPaginatedResult,
  PaginationParams,
} from '../../utils/helpers';
import { DEVICE_STATUS, ERROR_MESSAGES, DeviceStatusType } from '../../utils/constants';
import logger from '../../utils/logger';

// Types
interface DeviceFilters extends PaginationParams {
  status?: DeviceStatusType;
  reseller_id?: string;
  is_banned?: boolean;
}

/**
 * Calculate device status based on dates
 */
export function calculateDeviceStatus(device: {
  lifetime: boolean;
  activatedUntil: Date | null;
  trialStartedAt: Date | null;
  trialExpiresAt: Date | null;
  isBanned: boolean;
}): DeviceStatusType {
  if (device.isBanned) {
    return DEVICE_STATUS.EXPIRED;
  }

  if (device.lifetime) {
    return DEVICE_STATUS.LIFETIME;
  }

  if (device.activatedUntil && !isExpired(device.activatedUntil)) {
    return DEVICE_STATUS.ACTIVE;
  }

  if (device.trialStartedAt) {
    if (device.trialExpiresAt && !isExpired(device.trialExpiresAt)) {
      return DEVICE_STATUS.TRIAL;
    }
    return DEVICE_STATUS.EXPIRED;
  }

  if (device.activatedUntil && isExpired(device.activatedUntil)) {
    return DEVICE_STATUS.EXPIRED;
  }

  return DEVICE_STATUS.OPEN;
}

/**
 * Register a new device
 */
export async function registerDevice(
  deviceCode: string,
  pin: string,
  platform?: string,
  playerVersion?: string
) {
  // Check if device already exists
  const existing = await prisma.device.findUnique({
    where: { deviceCode },
  });

  if (existing) {
    throw ApiError.conflict(ERROR_MESSAGES.DEVICE_EXISTS);
  }

  // Hash PIN
  const pinHash = await hashPassword(pin);

  // Create device
  const device = await prisma.device.create({
    data: {
      deviceCode,
      pinHash,
      platform,
      playerVersion,
      status: DEVICE_STATUS.OPEN,
    },
  });

  // Log action
  await prisma.deviceLog.create({
    data: {
      deviceId: device.id,
      action: 'REGISTERED',
      details: { platform, playerVersion },
    },
  });

  // Generate token
  const token = generateDeviceToken({
    id: device.id,
    deviceCode: device.deviceCode,
  });

  logger.logDevice('Registered', deviceCode, { platform, playerVersion });

  return {
    device: {
      id: device.id,
      device_code: device.deviceCode,
      status: device.status,
    },
    token,
  };
}

/**
 * Authenticate device with PIN
 */
export async function authenticateDevice(deviceCode: string, pin: string) {
  // Find device
  const device = await prisma.device.findUnique({
    where: { deviceCode },
  });

  if (!device) {
    throw ApiError.notFound(ERROR_MESSAGES.DEVICE_NOT_FOUND);
  }

  // Verify PIN
  const isValidPin = await comparePassword(pin, device.pinHash);

  if (!isValidPin) {
    throw ApiError.unauthorized(ERROR_MESSAGES.INVALID_PIN);
  }

  // Check if banned
  if (device.isBanned) {
    throw ApiError.forbidden(ERROR_MESSAGES.DEVICE_BANNED);
  }

  // Calculate and sync status
  const calculatedStatus = calculateDeviceStatus(device);
  
  if (device.status !== calculatedStatus) {
    await prisma.device.update({
      where: { id: device.id },
      data: { status: calculatedStatus },
    });
  }

  // Update last seen
  await prisma.device.update({
    where: { id: device.id },
    data: { lastSeenAt: new Date() },
  });

  // Generate token
  const token = generateDeviceToken({
    id: device.id,
    deviceCode: device.deviceCode,
  });

  logger.logDevice('Authenticated', deviceCode);

  return {
    device: {
      id: device.id,
      device_code: device.deviceCode,
      status: calculatedStatus,
      lifetime: device.lifetime,
      activated_until: device.activatedUntil,
      trial_expires_at: device.trialExpiresAt,
    },
    token,
  };
}

/**
 * Get device status
 */
export async function getDeviceStatus(deviceCode: string) {
  const device = await prisma.device.findUnique({
    where: { deviceCode },
  });

  if (!device) {
    throw ApiError.notFound(ERROR_MESSAGES.DEVICE_NOT_FOUND);
  }

  // Calculate status
  const calculatedStatus = calculateDeviceStatus(device);

  // Sync if changed
  if (device.status !== calculatedStatus) {
    await prisma.device.update({
      where: { id: device.id },
      data: { status: calculatedStatus },
    });
  }

  return {
    device_code: device.deviceCode,
    status: calculatedStatus,
    lifetime: device.lifetime,
    activated_until: device.activatedUntil,
    trial_started_at: device.trialStartedAt,
    trial_expires_at: device.trialExpiresAt,
    is_banned: device.isBanned,
  };
}

/**
 * Get all devices with filters and pagination
 */
export async function getAllDevices(filters: DeviceFilters) {
  const { skip, take, page, limit } = getPaginationParams(filters);

  const where: Record<string, unknown> = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.reseller_id) {
    where.resellerId = filters.reseller_id;
  }

  if (filters.is_banned !== undefined) {
    where.isBanned = filters.is_banned;
  }

  const [devices, total] = await Promise.all([
    prisma.device.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        reseller: {
          select: {
            id: true,
            email: true,
            companyName: true,
          },
        },
        license: {
          select: {
            id: true,
            licenseKey: true,
            type: true,
          },
        },
        _count: {
          select: {
            playlists: true,
          },
        },
      },
    }),
    prisma.device.count({ where }),
  ]);

  return createPaginatedResult(devices, total, page, limit);
}

/**
 * Start trial for a device
 */
export async function startTrial(deviceCode: string, performedBy?: { adminId?: string; resellerId?: string }) {
  const device = await prisma.device.findUnique({
    where: { deviceCode },
  });

  if (!device) {
    throw ApiError.notFound(ERROR_MESSAGES.DEVICE_NOT_FOUND);
  }

  if (device.trialStartedAt) {
    throw ApiError.conflict(ERROR_MESSAGES.TRIAL_ALREADY_USED);
  }

  const trialExpiresAt = calculateTrialExpiration();

  const updated = await prisma.device.update({
    where: { id: device.id },
    data: {
      status: DEVICE_STATUS.TRIAL,
      trialStartedAt: new Date(),
      trialExpiresAt,
    },
  });

  // Log activation history
  await prisma.activationHistory.create({
    data: {
      deviceId: device.id,
      action: 'TRIAL_STARTED',
      previousStatus: device.status,
      newStatus: DEVICE_STATUS.TRIAL,
      adminId: performedBy?.adminId,
      resellerId: performedBy?.resellerId,
    },
  });

  logger.logDevice('Trial started', deviceCode, { expiresAt: trialExpiresAt });

  return updated;
}

/**
 * Ban a device
 */
export async function banDevice(deviceId: string, reason?: string, adminId?: string) {
  const device = await prisma.device.findUnique({
    where: { id: deviceId },
  });

  if (!device) {
    throw ApiError.notFound(ERROR_MESSAGES.DEVICE_NOT_FOUND);
  }

  const updated = await prisma.device.update({
    where: { id: deviceId },
    data: {
      isBanned: true,
      bannedReason: reason,
      status: DEVICE_STATUS.EXPIRED,
    },
  });

  // Log
  await prisma.activationHistory.create({
    data: {
      deviceId,
      action: 'BANNED',
      previousStatus: device.status,
      newStatus: DEVICE_STATUS.EXPIRED,
      adminId,
      details: reason ? { reason } : undefined,
    },
  });

  logger.logDevice('Banned', device.deviceCode, { reason });

  return updated;
}

/**
 * Unban a device
 */
export async function unbanDevice(deviceId: string, adminId?: string) {
  const device = await prisma.device.findUnique({
    where: { id: deviceId },
  });

  if (!device) {
    throw ApiError.notFound(ERROR_MESSAGES.DEVICE_NOT_FOUND);
  }

  const calculatedStatus = calculateDeviceStatus({ ...device, isBanned: false });

  const updated = await prisma.device.update({
    where: { id: deviceId },
    data: {
      isBanned: false,
      bannedReason: null,
      status: calculatedStatus,
    },
  });

  // Log
  await prisma.activationHistory.create({
    data: {
      deviceId,
      action: 'UNBANNED',
      previousStatus: DEVICE_STATUS.EXPIRED,
      newStatus: calculatedStatus,
      adminId,
    },
  });

  logger.logDevice('Unbanned', device.deviceCode);

  return updated;
}

/**
 * Prolong device activation
 */
export async function prolongDevice(deviceId: string, days: number, adminId?: string) {
  const device = await prisma.device.findUnique({
    where: { id: deviceId },
  });

  if (!device) {
    throw ApiError.notFound(ERROR_MESSAGES.DEVICE_NOT_FOUND);
  }

  // Calculate new expiration
  const baseDate = device.activatedUntil && !isExpired(device.activatedUntil)
    ? new Date(device.activatedUntil)
    : new Date();
  
  const newExpiration = new Date(baseDate);
  newExpiration.setDate(newExpiration.getDate() + days);

  const updated = await prisma.device.update({
    where: { id: deviceId },
    data: {
      status: DEVICE_STATUS.ACTIVE,
      activatedUntil: newExpiration,
    },
  });

  // Log
  await prisma.activationHistory.create({
    data: {
      deviceId,
      action: 'PROLONGED',
      previousStatus: device.status,
      newStatus: DEVICE_STATUS.ACTIVE,
      adminId,
      details: { days, newExpiration },
    },
  });

  logger.logDevice('Prolonged', device.deviceCode, { days, newExpiration });

  return updated;
}

/**
 * Activate device with lifetime
 */
export async function activateLifetime(deviceId: string, adminId?: string) {
  const device = await prisma.device.findUnique({
    where: { id: deviceId },
  });

  if (!device) {
    throw ApiError.notFound(ERROR_MESSAGES.DEVICE_NOT_FOUND);
  }

  const updated = await prisma.device.update({
    where: { id: deviceId },
    data: {
      status: DEVICE_STATUS.LIFETIME,
      lifetime: true,
    },
  });

  // Log
  await prisma.activationHistory.create({
    data: {
      deviceId,
      action: 'LIFETIME_ACTIVATED',
      previousStatus: device.status,
      newStatus: DEVICE_STATUS.LIFETIME,
      adminId,
    },
  });

  logger.logDevice('Lifetime activated', device.deviceCode);

  return updated;
}

/**
 * Search device by PIN (admin only)
 */
export async function searchByPin(pin: string) {
  // Get all devices and check PIN (not efficient but secure - PIN is hashed)
  const devices = await prisma.device.findMany({
    take: 100, // Limit for safety
  });

  for (const device of devices) {
    const matches = await comparePassword(pin, device.pinHash);
    if (matches) {
      return {
        id: device.id,
        device_code: device.deviceCode,
        status: device.status,
        platform: device.platform,
        created_at: device.createdAt,
      };
    }
  }

  return null;
}

export default {
  calculateDeviceStatus,
  registerDevice,
  authenticateDevice,
  getDeviceStatus,
  getAllDevices,
  startTrial,
  banDevice,
  unbanDevice,
  prolongDevice,
  activateLifetime,
  searchByPin,
};
