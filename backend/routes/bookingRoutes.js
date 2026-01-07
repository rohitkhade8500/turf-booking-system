const express = require('express');
const router = express.Router();
const { bookTurf, getMyBookings } = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware'); // Users must be logged in to book

// POST /api/bookings - Create a new booking
router.post('/', auth, bookTurf);

// GET /api/bookings/my-bookings - View booking history [cite: 26]
router.get('/my-bookings', auth, getMyBookings);
router.get('/all', auth, getAllBookings);

module.exports = router;