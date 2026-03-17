import Tour from '../models/Tour.js';

// @desc    Get all tours with optional placement filtering
// @route   GET /api/v1/tours
// @access  Public
export const getTours = async (req, res) => {
    try {
        const query = { status: 'active' };
        if (req.query.placement) {
            query.homePagePlacements = req.query.placement;
        }

        const tours = await Tour.find(query).sort({ order: 1, createdAt: -1 });
        res.json(tours);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all tours (including drafts) for admin panel
// @route   GET /api/v1/admin/tours
// @access  Private/Admin
export const getAdminTours = async (req, res) => {
    try {
        const tours = await Tour.find().sort({ createdAt: -1 });
        res.json(tours);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single tour by ID
// @route   GET /api/v1/tours/:id
// @access  Public
export const getTourById = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        if (tour) {
            res.json(tour);
        } else {
            res.status(404).json({ message: 'Tour not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new tour
// @route   POST /api/v1/admin/tours
// @access  Private/Admin
export const createTour = async (req, res) => {
    try {
        const tour = new Tour(req.body);
        const createdTour = await tour.save();
        res.status(201).json(createdTour);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a tour
// @route   PUT /api/v1/admin/tours/:id
// @access  Private/Admin
export const updateTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);

        if (tour) {
            Object.assign(tour, req.body);
            const updatedTour = await tour.save();
            res.json(updatedTour);
        } else {
            res.status(404).json({ message: 'Tour not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a tour
// @route   DELETE /api/v1/admin/tours/:id
// @access  Private/Admin
export const deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);

        if (tour) {
            await tour.deleteOne();
            res.json({ message: 'Tour removed' });
        } else {
            res.status(404).json({ message: 'Tour not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle tour status
// @route   PATCH /api/v1/admin/tours/:id/status
// @access  Private/Admin
export const updateTourStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const tour = await Tour.findById(req.params.id);

        if (tour) {
            tour.status = status;
            const updatedTour = await tour.save();
            res.json(updatedTour);
        } else {
            res.status(404).json({ message: 'Tour not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
