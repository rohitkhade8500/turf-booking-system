const Booking = require('../models/Booking');
const Turf = require('../models/Turf'); // Ensure this is imported!

exports.createBooking = async (req, res) => {
  try {
    const { turfId, date, slot } = req.body; // We don't even need 'price' from frontend anymore

    // 1. Validation
    if (!turfId || !date || !slot) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // 2. FETCH THE TURF TO GET THE REAL PRICE
    const turfDetails = await Turf.findById(turfId);
    if (!turfDetails) {
        return res.status(404).json({ message: "Turf not found" });
    }

    // 3. Check for overlapping bookings
    const existingBooking = await Booking.findOne({ turf: turfId, date, slot });
    if (existingBooking) {
      return res.status(400).json({ message: 'Slot already booked' });
    }

    // 4. Create Booking with the DATABASE Price
    const newBooking = new Booking({
      user: req.user.id,
      turf: turfId,
      date,
      slot,
      // We grab price directly from the turf document we just found
      totalPrice: turfDetails.pricePerHour || turfDetails.price || 0 
    });

    await newBooking.save();
    res.json(newBooking);

  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Keep getUserBookings and getAllBookings as they are...
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('turf');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

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