import express from 'express';
import { 
    getTours, 
    getAdminTours, 
    getTourById, 
    createTour, 
    updateTour, 
    deleteTour, 
    updateTourStatus 
} from '../controllers/tourController.js';

const router = express.Router();

// Public Routes
router.route('/').get(getTours);
router.route('/:id').get(getTourById);

// Admin Routes (In a real app, protect these with auth middleware)
router.route('/admin').get(getAdminTours).post(createTour);
router.route('/admin/:id')
    .put(updateTour)
    .delete(deleteTour);
router.route('/admin/:id/status').patch(updateTourStatus);

export default router;
