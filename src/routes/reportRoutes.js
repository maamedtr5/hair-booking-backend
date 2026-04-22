import express from 'express';
import { getRevenueReportHandler, getTopServicesReportHandler } from '../controllers/reportController.js';

const router = express.Router();
router.get('/revenue', getRevenueReportHandler);
router.get('/top-services', getTopServicesReportHandler);
export default router;
