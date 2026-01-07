const express = require('express');
const router = express.Router();
const { createTurf, getAllTurfs, getTurfById } = require('../controllers/turfController');
const auth = require('../middleware/authMiddleware'); // Checks if user is logged in
const admin = require('../middleware/adminMiddleware'); // Checks if user is admin

// POST /api/turfs - Create a turf (Protected: Login + Admin required)
router.post('/', auth, admin, createTurf);

// GET /api/turfs - Get all turfs (Public)
router.get('/', getAllTurfs);

// GET /api/turfs/:id - Get specific turf details (Public)
router.get('/:id', getTurfById);

module.exports = router;