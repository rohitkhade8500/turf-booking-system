const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    turf: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Turf', 
        required: true 
    },
    date: { 
        type: String, 
        required: true // Storing as "YYYY-MM-DD" is easiest
    },
    slot: { 
        type: String, 
        required: true // e.g., "10:00-11:00"
    },
    totalPrice: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['confirmed', 'cancelled'], 
        default: 'confirmed' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);