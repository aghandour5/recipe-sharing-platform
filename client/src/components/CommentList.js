import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const CommentList = ({ recipeId, initialComments }) => {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to comment.');
      return;
    }
    if (!newComment.trim()) {
      alert('Comment cannot be empty.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/comments', {
        recipe_id: recipeId,
        content: newComment.trim(),
      });
      // Optimistically add the new comment to the list
      setComments([response.data.comment, ...comments]); // Add new comment to the top
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error.response?.data?.message || error.message);
      alert(`Failed to add comment: ${error.response?.data?.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete your comment?')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error.response?.data?.message || error.message);
      alert(`Failed to delete comment: ${error.response?.data?.message || 'Please try again.'}`);
    }
  };

  return (
    <div style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
      <h3>Comments ({comments.length})</h3>
      {isAuthenticated ? (
        <form onSubmit={handleAddComment} style={{ marginBottom: '1rem' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows="4"
            placeholder="Share your thoughts on this recipe..."
            style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', marginBottom: '0.5rem' }}
            disabled={isSubmitting}
          />
          <button type="submit" disabled={isSubmitting} style={{ padding: '0.5rem 1rem' }}>
            {isSubmitting ? 'Posting Comment...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p style={{ marginBottom: '1rem' }}><em>Please <a href="/login">log in</a> to leave a comment.</em></p>
      )}

      {comments.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {comments.map((comment) => (
            <li key={comment.id} style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong>{comment.user.username}</strong>
                <span style={{ fontSize: '0.8em', color: '#666' }}>
                  {new Date(comment.created_at).toLocaleDateString()} {new Date(comment.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{comment.content}</p>
              {isAuthenticated && user && user.id === comment.user.id && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  style={{ background: 'none', border: '1px solid #ccc', color: 'red', cursor: 'pointer', padding: '0.25rem 0.5rem', marginTop: '0.5rem', fontSize: '0.8em' }}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        !isAuthenticated && <p>No comments yet. Be the first to share your thoughts!</p> // Or a more generic message if authenticated but no comments
      )}
    </div>
  );
};

export default CommentList;