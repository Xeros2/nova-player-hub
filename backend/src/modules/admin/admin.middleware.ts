/**
 * Nova Player - Admin Middleware
 * Additional authentication middlewares
 */

import { Request, Response, NextFunction } from 'express';
import { verifyDeviceToken, extractToken, DeviceTokenPayload } from '../../config/jwt';
import { ApiError } from '../../middlewares/errorHandler';
import { ERROR_MESSAGES } from '../../utils/constants';

declare global {
  namespace Express {
    interface Request {
      device?: DeviceTokenPayload;
    }
  }
}

/**
 * Authenticate Device via JWT
 */
export function authDevice(req: Request, res: Response, next: NextFunction): void {
  try {
    const token = extractToken(req.headers.authorization);
    if (!token) throw ApiError.unauthorized(ERROR_MESSAGES.TOKEN_REQUIRED);
    
    const decoded = verifyDeviceToken(token);
    if (!decoded) throw ApiError.unauthorized(ERROR_MESSAGES.INVALID_TOKEN);
    
    req.device = decoded;
    next();
  } catch (error) {
    next(error);
  }
}
