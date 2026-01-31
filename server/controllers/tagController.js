const db = require('../config/db');

// @desc    Get all tags
// @route   GET /api/tags
const getTags = async (req, res) => {
  try {
    const result = await db.query('SELECT id, name FROM tags ORDER BY name ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get Tags Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getTags,
};