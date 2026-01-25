const db = require('../config/db');

// @desc    Get all categories
// @route   GET /api/categories
const getCategories = async (req, res) => {
  try {
    const result = await db.query('SELECT id, name FROM categories ORDER BY name ASC');
    res.status(200).json(result.rows); // Send back the array of row objects categories to JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getCategories,
}; // Export the controller function