const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
// ⚠️ NOTICE: getAllBookings is added here now!
const { createBooking, getUserBookings, getAllBookings } = require('../controllers/bookingController'); 

router.post('/', auth, createBooking);
router.get('/my-bookings', auth, getUserBookings);
router.get('/all', auth, getAllBookings); // This line will work now

module.exports = router;