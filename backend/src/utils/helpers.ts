/**
 * Nova Player - Helper Utilities
 * Common utility functions
 */

import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
}

/**
 * Compare a password with a hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a random PIN of specified length
 */
export function generatePin(length = 6): string {
  let pin = '';
  for (let i = 0; i < length; i++) {
    pin += Math.floor(Math.random() * 10).toString();
  }
  return pin;
}

/**
 * Generate a unique license key
 * Format: NOVA-XXXX-XXXX-XXXX
 */
export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments: string[] = ['NOVA'];
  
  for (let s = 0; s < 3; s++) {
    let segment = '';
    for (let i = 0; i < 4; i++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    segments.push(segment);
  }
  
  return segments.join('-');
}

/**
 * Generate a UUID
 */
export function generateUUID(): string {
  return uuidv4();
}

/**
 * Calculate trial expiration date
 */
export function calculateTrialExpiration(): Date {
  const now = new Date();
  now.setDate(now.getDate() + env.TRIAL_DURATION_DAYS);
  return now;
}

/**
 * Calculate activation expiration date
 */
export function calculateActivationExpiration(days: number): Date {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now;
}

/**
 * Check if a date has expired
 */
export function isExpired(date: Date | null | undefined): boolean {
  if (!date) return true;
  return new Date() > new Date(date);
}

/**
 * Sanitize a URL for playlist storage
 */
export function sanitizePlaylistUrl(url: string): string {
  let sanitized = url.trim();
  
  // Add protocol if missing
  if (!sanitized.match(/^https?:\/\//i)) {
    sanitized = 'http://' + sanitized;
  }
  
  return sanitized;
}

/**
 * Paginate results
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function getPaginationParams(params: PaginationParams): { skip: number; take: number; page: number; limit: number } {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 20));
  const skip = (page - 1) * limit;
  
  return { skip, take: limit, page, limit };
}

export function createPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * Format date for API response
 */
export function formatDate(date: Date | null | undefined): string | null {
  if (!date) return null;
  return new Date(date).toISOString();
}

/**
 * Sleep for a specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  hashPassword,
  comparePassword,
  generatePin,
  generateLicenseKey,
  generateUUID,
  calculateTrialExpiration,
  calculateActivationExpiration,
  isExpired,
  sanitizePlaylistUrl,
  getPaginationParams,
  createPaginatedResult,
  formatDate,
  sleep,
};
