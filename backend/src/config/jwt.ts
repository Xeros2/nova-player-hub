/**
 * Nova Player - JWT Configuration
 * Token generation and verification utilities
 */

import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { env } from './env';

// Token types
export type TokenType = 'admin' | 'business' | 'device';

// Payload interfaces
export interface AdminTokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
  type: 'TECH';
}

export interface BusinessTokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
  type: 'BUSINESS';
}

export interface DeviceTokenPayload extends JwtPayload {
  id: string;
  deviceCode: string;
  type: 'DEVICE';
}

export type TokenPayload = AdminTokenPayload | BusinessTokenPayload | DeviceTokenPayload;

/**
 * Get JWT secret based on token type
 */
function getSecret(type: TokenType): string {
  switch (type) {
    case 'admin':
      return env.ADMIN_JWT_SECRET;
    case 'business':
      return env.BUSINESS_JWT_SECRET;
    case 'device':
      return env.DEVICE_JWT_SECRET;
    default:
      throw new Error(`Unknown token type: ${type}`);
  }
}

/**
 * Get JWT expiration based on token type
 */
function getExpiration(type: TokenType): string {
  switch (type) {
    case 'admin':
      return env.ADMIN_JWT_EXPIRES_IN;
    case 'business':
      return env.BUSINESS_JWT_EXPIRES_IN;
    case 'device':
      return env.DEVICE_JWT_EXPIRES_IN;
    default:
      throw new Error(`Unknown token type: ${type}`);
  }
}

/**
 * Generate Admin TECH JWT token
 */
export function generateAdminToken(payload: Omit<AdminTokenPayload, 'type' | 'iat' | 'exp'>): string {
  const options: SignOptions = {
    expiresIn: getExpiration('admin'),
    algorithm: 'HS256',
  };

  return jwt.sign(
    { ...payload, type: 'TECH' },
    getSecret('admin'),
    options
  );
}

/**
 * Generate Business Admin JWT token
 */
export function generateBusinessToken(payload: Omit<BusinessTokenPayload, 'type' | 'iat' | 'exp'>): string {
  const options: SignOptions = {
    expiresIn: getExpiration('business'),
    algorithm: 'HS256',
  };

  return jwt.sign(
    { ...payload, type: 'BUSINESS' },
    getSecret('business'),
    options
  );
}

/**
 * Generate Device JWT token
 */
export function generateDeviceToken(payload: Omit<DeviceTokenPayload, 'type' | 'iat' | 'exp'>): string {
  const options: SignOptions = {
    expiresIn: getExpiration('device'),
    algorithm: 'HS256',
  };

  return jwt.sign(
    { ...payload, type: 'DEVICE' },
    getSecret('device'),
    options
  );
}

/**
 * Verify Admin TECH JWT token
 */
export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const decoded = jwt.verify(token, getSecret('admin')) as AdminTokenPayload;
    if (decoded.type !== 'TECH') {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Verify Business Admin JWT token
 */
export function verifyBusinessToken(token: string): BusinessTokenPayload | null {
  try {
    const decoded = jwt.verify(token, getSecret('business')) as BusinessTokenPayload;
    if (decoded.type !== 'BUSINESS') {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Verify Device JWT token
 */
export function verifyDeviceToken(token: string): DeviceTokenPayload | null {
  try {
    const decoded = jwt.verify(token, getSecret('device')) as DeviceTokenPayload;
    if (decoded.type !== 'DEVICE') {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return null;
  }

  return parts[1];
}

export default {
  generateAdminToken,
  generateBusinessToken,
  generateDeviceToken,
  verifyAdminToken,
  verifyBusinessToken,
  verifyDeviceToken,
  extractToken,
};
