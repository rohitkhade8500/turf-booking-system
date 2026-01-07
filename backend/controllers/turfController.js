const Turf = require('../models/Turf');

// @desc    Add a new Turf
// @route   POST /api/turfs
// @access  Private (Admin only)
exports.createTurf = async (req, res) => {
    try {
        const { name, sportType, location, pricePerHour, slots } = req.body;

        const newTurf = new Turf({
            name,
            sportType,
            location,
            pricePerHour,
            slots // Expecting an array like ["09:00-10:00", "10:00-11:00"]
        });

        const turf = await newTurf.save();
        res.status(201).json(turf);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get All Turfs
// @route   GET /api/turfs
// @access  Public
exports.getAllTurfs = async (req, res) => {
    try {
        // Find all turfs in the DB
        const turfs = await Turf.find();
        res.json(turfs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get Single Turf by ID
// @route   GET /api/turfs/:id
// @access  Public
exports.getTurfById = async (req, res) => {
    try {
        const turf = await Turf.findById(req.params.id);
        if (!turf) {
            return res.status(404).json({ message: 'Turf not found' });
        }
        res.json(turf);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Turf not found' });
        }
        res.status(500).send('Server Error');
    }
};