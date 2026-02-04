const express = require('express');
const router = express.Router();
const { submitRating } = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/ratings - Submit or update a rating
router.post('/', protect, submitRating);

module.exports = router;