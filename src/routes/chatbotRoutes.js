import express from 'express';
import { recommendTours, captureLead } from '../controllers/chatbotController.js';

const router = express.Router();

router.post('/recommend', recommendTours);
router.post('/lead', captureLead);

export default router;
