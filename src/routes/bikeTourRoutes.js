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

// Admin Routes (Static first)
router.route('/admin').get(getAdminBikeTours).post(createBikeTour);
router.route('/admin/:id')
    .put(updateBikeTour)
    .delete(deleteBikeTour);

// Public Routes (Specific first)
router.route('/slug/:slug').get(getBikeTourBySlug);
router.route('/').get(getBikeTours);
router.route('/:id').get(getBikeTourById);

export default router;
