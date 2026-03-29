import BikeTour from '../models/BikeTour.js';

/**
 * @desc    Get all bike tours (Public)
 * @route   GET /api/v1/bike-tours
 */
export const getBikeTours = async (req, res) => {
    try {
        const query = { status: 'active' };
        
        // Basic filtering
        if (req.query.country) query.country = req.query.country;
        if (req.query.destination) query.destination = req.query.destination;
        if (req.query.tourType) query.tourType = req.query.tourType;
        if (req.query.difficulty) query.difficulty = req.query.difficulty;

        const tours = await BikeTour.find(query).sort({ createdAt: -1 });
        res.status(200).json(tours);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get all bike tours for admin (All statuses)
 * @route   GET /api/v1/bike-tours/admin
 */
export const getAdminBikeTours = async (req, res) => {
    try {
        const tours = await BikeTour.find().sort({ createdAt: -1 });
        res.status(200).json(tours);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get single bike tour
 * @route   GET /api/v1/bike-tours/:id
 */
export const getBikeTourById = async (req, res) => {
    try {
        const tour = await BikeTour.findById(req.params.id);
        if (!tour) return res.status(404).json({ message: 'Tour not found' });
        res.status(200).json(tour);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get bike tour by slug
 * @route   GET /api/v1/bike-tours/slug/:slug
 */
export const getBikeTourBySlug = async (req, res) => {
    try {
        const tour = await BikeTour.findOne({ slug: req.params.slug, status: 'active' });
        if (!tour) return res.status(404).json({ message: 'Tour not found' });
        res.status(200).json(tour);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Create new bike tour
 * @route   POST /api/v1/bike-tours/admin
 */
export const createBikeTour = async (req, res) => {
    try {
        const tour = await BikeTour.create(req.body);
        res.status(201).json(tour);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Update bike tour
 * @route   PUT /api/v1/bike-tours/admin/:id
 */
export const updateBikeTour = async (req, res) => {
    try {
        const tour = await BikeTour.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });
        if (!tour) return res.status(404).json({ message: 'Tour not found' });
        res.status(200).json(tour);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Delete bike tour
 * @route   DELETE /api/v1/bike-tours/admin/:id
 */
export const deleteBikeTour = async (req, res) => {
    try {
        const tour = await BikeTour.findByIdAndDelete(req.params.id);
        if (!tour) return res.status(404).json({ message: 'Tour not found' });
        res.status(200).json({ message: 'Tour deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
