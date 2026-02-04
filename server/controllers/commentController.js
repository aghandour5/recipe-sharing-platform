const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// @desc    Add a new comment to a recipe
// @route   POST /api/comments
const addComment = async (req, res) => {
  const { recipe_id, content } = req.body;
  const userId = req.user.id;

  if (!recipe_id || !content || content.trim() === '') {
    return res.status(400).json({ message: 'Recipe ID and content are required.' });
  }

  try {
    // Insert comment
    const insertResult = await db.query(
      `
      INSERT INTO comments (user_id, recipe_id, content)
      VALUES ($1, $2, $3)
      RETURNING id, content, created_at, user_id
      `,
      [userId, recipe_id, content.trim()]
    );

    const comment = insertResult.rows[0];

    // Fetch user info
    const userResult = await db.query(
      `SELECT id, username FROM users WHERE id = $1`,
      [comment.user_id]
    );

    res.status(201).json({
      message: 'Comment added successfully',
      comment: {
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        user: userResult.rows[0],
      },
    });
  } catch (error) {
    console.error('Add Comment Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
const deleteComment = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id; // From protect middleware

  try {
    // Check if comment exists and belongs to the user
    const commentCheck = await db.query(
      'SELECT * FROM comments WHERE id = $1 AND user_id = $2',
      [commentId, userId]
    );
    const existingComment = commentCheck.rows[0];

    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found or you are not authorized to delete it' });
    }

    await db.query('DELETE FROM comments WHERE id = $1', [commentId]);
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete Comment Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  addComment,
  deleteComment,
};