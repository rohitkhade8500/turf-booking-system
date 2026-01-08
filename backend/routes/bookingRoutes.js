const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

// Import all 3 functions
const { createBooking, getUserBookings, getAllBookings } = require('../controllers/bookingController');

// Define Routes
router.post('/', auth, createBooking);               // Create
router.get('/my-bookings', auth, getUserBookings);   // User View
router.get('/all', auth, getAllBookings);            // Admin View

module.exports = router;