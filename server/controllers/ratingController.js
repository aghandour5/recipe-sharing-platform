// This controller will handle submitting new ratings or updating existing ones.
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// @desc    Submit or update a rating for a recipe
// @route   POST /api/ratings
const submitRating = async (req, res) => {
  const { recipe_id, value } = req.body;
  const userId = req.user.id; // From protect middleware

  if (!recipe_id || value === undefined || isNaN(value) || value < 1 || value > 5) {
    return res.status(400).json({ message: 'Valid recipe_id and a rating value between 1 and 5 are required.' });
  }

  try {
    // Check if user has already rated this recipe
    const existingRatingResult = await db.query(
      'SELECT id FROM ratings WHERE user_id = $1 AND recipe_id = $2',
      [userId, recipe_id]
    );
    const existingRating = existingRatingResult.rows[0];

    let result;
    if (existingRating) {
      // Update existing rating
      result = await db.query(
        'UPDATE ratings SET value = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [value, existingRating.id]
      );
      res.status(200).json({ message: 'Rating updated successfully', rating: result.rows[0] });
    } else {
      // Insert new rating
      result = await db.query(
        'INSERT INTO ratings (user_id, recipe_id, value) VALUES ($1, $2, $3) RETURNING *',
        [userId, recipe_id, value]
      );
      res.status(201).json({ message: 'Rating submitted successfully', rating: result.rows[0] });
    }
  } catch (error) {
    console.error('Submit Rating Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  submitRating,
};