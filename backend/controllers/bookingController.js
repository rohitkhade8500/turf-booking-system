const Booking = require('../models/Booking');
const Turf = require('../models/Turf');

// @desc    Book a slot
// @route   POST /api/bookings
// @access  Private (User)
exports.bookTurf = async (req, res) => {
    try {
        const { turfId, date, slot } = req.body;

        // 1. Check if the turf actually exists
        const turf = await Turf.findById(turfId);
        if (!turf) {
            return res.status(404).json({ message: 'Turf not found' });
        }

        // 2. CHECK AVAILABILITY (Crucial Step) [cite: 75-76]
        // We look for any booking with the same Turf, same Date, and same Slot
        const existingBooking = await Booking.findOne({ turf: turfId, date, slot });
        
        if (existingBooking) {
            return res.status(400).json({ message: 'Slot already booked! Please choose another.' });
        }

        // 3. Create the Booking
        const newBooking = new Booking({
            user: req.user.id, // Comes from the logged-in user token
            turf: turfId,
            date,
            slot,
            totalPrice: turf.pricePerHour, // Using the turf's price
            status: 'confirmed'
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking Confirmed!', booking: newBooking });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get My Bookings (User's history)
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
    try {
        // Find bookings where user matches the logged-in ID
        // .populate('turf') fills in the turf details (name, location) automatically
        const bookings = await Booking.find({ user: req.user.id }).populate('turf', 'name location sportType');
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get ALL bookings (Admin only)
exports.getAllBookings = async (req, res) => {
    try {
        // .populate() replaces the ID with actual data (User name, Turf name)
        const bookings = await Booking.find()
            .populate('user', 'name email') 
            .populate('turf', 'name'); 
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};