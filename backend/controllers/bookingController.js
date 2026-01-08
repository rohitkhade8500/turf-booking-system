const Booking = require('../models/Booking');
const Turf = require('../models/Turf');

// 1. Create a Booking (User)
exports.createBooking = async (req, res) => {
  try {
    const { turfId, date, slot, price } = req.body;
    
    // Validation: Ensure all fields are present
    if (!turfId || !date || !slot || !price) {
      return res.status(400).json({ message: 'Missing required fields: turfId, date, slot, or price' });
    }

    // Check if slot is already booked
    const existingBooking = await Booking.findOne({ turf: turfId, date, slot });
    if (existingBooking) {
      return res.status(400).json({ message: 'This slot is already booked!' });
    }

    // Create new booking
    const newBooking = new Booking({
      user: req.user.id,
      turf: turfId, // We map 'turfId' from frontend to 'turf' in database
      date,
      slot,
      totalPrice: price
    });

    await newBooking.save();
    res.json(newBooking);

  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
};

// 2. Get My Bookings (User)
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('turf');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// 3. Get ALL Bookings (Admin Only)
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