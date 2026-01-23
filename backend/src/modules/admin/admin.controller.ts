/**
 * Nova Player - Admin Controller
 */
import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorHandler';
import * as adminService from './admin.service';
import * as devicesService from '../core/devices.service';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../utils/constants';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await adminService.loginAdmin(email, password);
  res.status(HTTP_STATUS.OK).json({ success: true, message: SUCCESS_MESSAGES.LOGIN_SUCCESS, data: result });
});

export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await adminService.getStats();
  res.status(HTTP_STATUS.OK).json({ success: true, data: stats });
});

export const getDevices = asyncHandler(async (req: Request, res: Response) => {
  const result = await devicesService.getAllDevices(req.query as never);
  res.status(HTTP_STATUS.OK).json({ success: true, data: result });
});

export const banDevice = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  await devicesService.banDevice(id, reason, req.admin?.id);
  res.status(HTTP_STATUS.OK).json({ success: true, message: SUCCESS_MESSAGES.DEVICE_BANNED });
});

export const unbanDevice = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await devicesService.unbanDevice(id, req.admin?.id);
  res.status(HTTP_STATUS.OK).json({ success: true, message: SUCCESS_MESSAGES.DEVICE_UNBANNED });
});

export const prolongDevice = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { days } = req.body;
  await devicesService.prolongDevice(id, days, req.admin?.id);
  res.status(HTTP_STATUS.OK).json({ success: true, message: SUCCESS_MESSAGES.DEVICE_PROLONGED });
});
