import express from 'express';
import { 
    getBikeTours, 
    getAdminBikeTours, 
    getBikeTourById, 
    getBikeTourBySlug,
    createBikeTour, 
    updateBikeTour, 
    deleteBikeTour 
} from '../controllers/bikeTourController.js';

const router = express.Router();

// Public Routes
router.route('/').get(getBikeTours);
router.route('/:id').get(getBikeTourById);
router.route('/slug/:slug').get(getBikeTourBySlug);

// Admin Routes
router.route('/admin').get(getAdminBikeTours).post(createBikeTour);
router.route('/admin/:id')
    .put(updateBikeTour)
    .delete(deleteBikeTour);

export default router;
