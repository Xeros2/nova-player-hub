/**
 * Nova Player - Business Admin Authentication Middleware
 * JWT verification for business admin operations with role-based access
 */

import { Request, Response, NextFunction } from 'express';
import { verifyBusinessToken, extractToken, BusinessTokenPayload } from '../config/jwt';
import { ApiError } from './errorHandler';
import { ERROR_MESSAGES, ADMIN_ROLE } from '../utils/constants';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      businessAdmin?: BusinessTokenPayload;
    }
  }
}

/**
 * Authenticate Business Admin
 * Verifies JWT token signed with BUSINESS_JWT_SECRET
 */
export function authBusiness(req: Request, res: Response, next: NextFunction): void {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      throw ApiError.unauthorized(ERROR_MESSAGES.TOKEN_REQUIRED);
    }

    const decoded = verifyBusinessToken(token);

    if (!decoded) {
      throw ApiError.unauthorized(ERROR_MESSAGES.INVALID_TOKEN);
    }

    // Attach business admin info to request
    req.businessAdmin = decoded;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Require specific business roles
 * @param allowedRoles - Array of allowed roles
 */
export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.businessAdmin) {
        throw ApiError.unauthorized(ERROR_MESSAGES.TOKEN_REQUIRED);
      }

      if (!allowedRoles.includes(req.businessAdmin.role)) {
        throw ApiError.forbidden(ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Require SUPER_ADMIN role
 */
export function requireSuperAdmin(req: Request, res: Response, next: NextFunction): void {
  return requireRole([ADMIN_ROLE.SUPER_ADMIN])(req, res, next);
}

/**
 * Require at least BUSINESS_ADMIN role
 */
export function requireBusinessAdmin(req: Request, res: Response, next: NextFunction): void {
  return requireRole([ADMIN_ROLE.SUPER_ADMIN, ADMIN_ROLE.BUSINESS_ADMIN])(req, res, next);
}

/**
 * Allow SUPPORT role (read-only operations)
 */
export function allowSupport(req: Request, res: Response, next: NextFunction): void {
  return requireRole([ADMIN_ROLE.SUPER_ADMIN, ADMIN_ROLE.BUSINESS_ADMIN, ADMIN_ROLE.SUPPORT])(req, res, next);
}

export default authBusiness;
