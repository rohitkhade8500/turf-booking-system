const Booking = require('../models/Booking');
const Turf = require('../models/Turf');

// 1. Create a Booking
exports.createBooking = async (req, res) => {
  try {
    const { turfId, date, slot, price } = req.body;
    
    // Check if slot is already booked
    const existingBooking = await Booking.findOne({ turf: turfId, date, slot });
    if (existingBooking) {
      return res.status(400).json({ message: 'Slot already booked' });
    }

    const newBooking = new Booking({
      user: req.user.id,
      turf: turfId,
      date,
      slot,
      totalPrice: price
    });

    await newBooking.save();
    res.json(newBooking);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// 2. Get User's Bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('turf');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// 3. Get ALL Bookings (For Admin) - THIS WAS MISSING OR BROKEN
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email') 
            .populate('turf', 'name'); 
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};