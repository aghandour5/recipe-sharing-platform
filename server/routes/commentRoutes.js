const express = require('express');
const router = express.Router();
const { addComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/comments - Add a new comment
router.post('/', protect, addComment);

// DELETE /api/comments/:id - Delete a comment
router.delete('/:id', protect, deleteComment);

module.exports = router;