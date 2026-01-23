/**
 * Nova Player - Admin TECH Authentication Middleware
 * JWT verification for technical admin operations
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAdminToken, extractToken, AdminTokenPayload } from '../config/jwt';
import { ApiError } from './errorHandler';
import { ERROR_MESSAGES } from '../utils/constants';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      admin?: AdminTokenPayload;
    }
  }
}

/**
 * Authenticate Admin TECH
 * Verifies JWT token signed with ADMIN_JWT_SECRET
 */
export function authAdmin(req: Request, res: Response, next: NextFunction): void {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      throw ApiError.unauthorized(ERROR_MESSAGES.TOKEN_REQUIRED);
    }

    const decoded = verifyAdminToken(token);

    if (!decoded) {
      throw ApiError.unauthorized(ERROR_MESSAGES.INVALID_TOKEN);
    }

    // Attach admin info to request
    req.admin = decoded;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Require specific admin roles (for TECH admins)
 */
export function requireAdminRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.admin) {
        throw ApiError.unauthorized(ERROR_MESSAGES.TOKEN_REQUIRED);
      }

      if (!allowedRoles.includes(req.admin.role)) {
        throw ApiError.forbidden(ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export default authAdmin;
