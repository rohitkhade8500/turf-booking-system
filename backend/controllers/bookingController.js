const Booking = require('../models/Booking');
const Turf = require('../models/Turf');

// 1. Create a Booking
exports.createBooking = async (req, res) => {
  try {
    console.log("📥 Receiving Booking Request:", req.body); // Check Render Logs for this line

    const { turfId, date, slot, price } = req.body;
    
    // VALIDATION: Check required fields
    if (!turfId || !date || !slot) {
      return res.status(400).json({ message: 'Missing required fields: turfId, date, or slot' });
    }

    // Check if slot is already booked
    const existingBooking = await Booking.findOne({ turf: turfId, date, slot });
    if (existingBooking) {
      return res.status(400).json({ message: 'Slot already booked' });
    }

    // SAFE PRICE LOGIC: If price is missing, save 0 so server doesn't crash
    const finalPrice = price ? Number(price) : 0;

    const newBooking = new Booking({
      user: req.user.id,
      turf: turfId,
      date,
      slot,
      totalPrice: finalPrice
    });

    await newBooking.save();
    console.log("✅ Booking Saved Successfully!");
    res.json(newBooking);

  } catch (err) {
    console.error("🔥 SERVER CRASH ERROR:", err);
    // Send the actual error message to the frontend so we can see it
    res.status(500).json({ message: 'Server Error: ' + err.message });
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

// 3. Get ALL Bookings (For Admin)
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