const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

// Import all 3 functions explicitly
const { createBooking, getUserBookings, getAllBookings } = require('../controllers/bookingController');

// Define the routes
router.post('/', auth, createBooking);               // POST /api/bookings (Create)
router.get('/my-bookings', auth, getUserBookings);   // GET /api/bookings/my-bookings (User History)
router.get('/all', auth, getAllBookings);            // GET /api/bookings/all (Admin View)

module.exports = router;