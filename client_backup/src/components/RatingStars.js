import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const RatingStars = ({ recipeId, avgRating, currentUserRating }) => {
  const { isAuthenticated } = useAuth();
  const [userRating, setUserRating] = useState(currentUserRating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingSubmit = async (ratingValue) => {
    if (!isAuthenticated) {
      alert('Please log in to rate this recipe.');
      return;
    }
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/ratings', {
        recipe_id: recipeId,
        value: ratingValue,
      });
      setUserRating(ratingValue);
      console.log('Rating submitted/updated:', response.data.message);
    } catch (error) {
      console.error('Error submitting rating:', error.response?.data?.message || error.message);
      alert(`Failed to submit rating: ${error.response?.data?.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #eee', borderRadius: '5px', background: '#f9f9f9' }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Average Rating:</strong> {avgRating ? `${avgRating} / 5` : 'Not yet rated'}
      </div>
      {isAuthenticated ? (
        <div>
          <strong>Your Rating:</strong>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  cursor: 'pointer',
                  fontSize: '2rem',
                  color: star <= (hoverRating || userRating) ? 'gold' : '#ccc',
                  marginLeft: '2px',
                }}
                onClick={() => handleRatingSubmit(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </span>
            ))}
            {isSubmitting && <span style={{ marginLeft: '10px' }}>Submitting...</span>}
            {userRating > 0 && !isSubmitting && <span style={{ marginLeft: '10px' }}>(You rated {userRating} star{userRating !== 1 ? 's' : ''})</span>}
          </div>
        </div>
      ) : (
        <p><em>Please log in to rate this recipe.</em></p>
      )}
    </div>
  );
};

export default RatingStars;