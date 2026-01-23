/**
 * Nova Player - Admin Routes (TECH)
 */
import { Router } from 'express';
import * as adminController from './admin.controller';
import { authAdmin } from '../../middlewares/authAdmin';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validator';
import { loginLimiter, adminLimiter } from '../../middlewares/rateLimiter';

const router = Router();

router.post('/login', loginLimiter, validateBody('adminLogin'), adminController.login);

router.use(authAdmin);
router.use(adminLimiter);

router.get('/stats', adminController.getStats);
router.get('/devices', validateQuery('deviceFilterQuery'), adminController.getDevices);
router.post('/devices/:id/ban', validateParams('uuidParam'), validateBody('adminBan'), adminController.banDevice);
router.post('/devices/:id/unban', validateParams('uuidParam'), adminController.unbanDevice);
router.post('/devices/:id/prolong', validateParams('uuidParam'), validateBody('adminProlong'), adminController.prolongDevice);

export default router;
