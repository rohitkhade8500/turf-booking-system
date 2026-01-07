const mongoose = require('mongoose');

const TurfSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    sportType: { 
        type: String, 
        required: true // e.g., "Football", "Cricket"
    },
    location: { 
        type: String, 
        required: true 
    },
    pricePerHour: { 
        type: Number, 
        required: true 
    },
    // Standard operating slots, e.g., ["09:00", "10:00", ...]
    slots: [{ 
        type: String 
    }]
}, { timestamps: true });

module.exports = mongoose.model('Turf', TurfSchema);