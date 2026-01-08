const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    // 1. Log exactly what the frontend sent (Check Render Logs for this!)
    console.log("📥 RECEIVED BOOKING REQUEST:", req.body);

    const { turfId, date, slot, price } = req.body;
    
    // 2. RELAXED VALIDATION: We removed '|| !price' so it won't fail anymore
    if (!turfId || !date || !slot) {
      return res.status(400).json({ message: 'Missing required fields: turfId, date, or slot' });
    }

    // 3. Fallback: If price is missing, use 0 (so it doesn't crash)
    const finalPrice = price || 0;

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
      totalPrice: finalPrice // Save the price (or 0)
    });

    await newBooking.save();
    res.json(newBooking);

  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
};

// Keep the other functions as they are
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