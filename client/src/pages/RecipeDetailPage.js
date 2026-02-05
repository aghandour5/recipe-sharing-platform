import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import RatingStars from '../components/RatingStars'; // Import RatingStars
import CommentList from '../components/CommentList';   // Import CommentList

const RecipeDetailPage = () => {
  const { id } = useParams(); // This is a hook from react-router-dom. It looks at the URL address bar, and extracts the value of :id from the route /recipes/:id
  const [recipe, setRecipe] = useState(null); // It starts as null because we haven't fetched it from the server yet.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user, logout } = useAuth(); // Custom hook to access auth context
  const navigate = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        // 1. Grab the token directly from storage
        const token = localStorage.getItem('token');

        // 2. Add it to the headers
        const response = await axios.get(`http://localhost:5000/api/recipes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setRecipe(response.data);
      } catch (err) {
        // If 401, token might be expired, handle logout?
        if (err.response?.status === 401) {
          logout(); 
        }
        setError(err.response?.data?.message || 'Failed to fetch recipe');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]); // Re-fetch if ID changes

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await axios.delete(`http://localhost:5000/api/recipes/${id}`);
        navigate('/'); // Redirect to home page after deletion
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete recipe');
      }
    }
  };

  if (loading) return <p>Loading recipe...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  const isOwner = isAuthenticated && user && user.id === recipe.user.id;

  return (
    <div className="recipe-detail" style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
      <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>{recipe.title}</h1>
      {recipe.image_url && (
        <img
          src={recipe.image_url} // Use relative path so CRA proxy serves /uploads from the API
          alt={recipe.title}
          style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '4px', marginBottom: '1rem', border: '1px solid #ddd' }}
        />
      )}
      <p style={{ fontSize: '1.1em', color: '#555', marginBottom: '1rem' }}><strong>Description:</strong> {recipe.description || 'No description provided.'}</p>
      <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
        <h3>Instructions</h3>
        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'sans-serif', fontSize: '1em', lineHeight: '1.6' }}>{recipe.instructions}</pre>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {recipe.prep_time_minutes && <p><strong>Prep Time:</strong> {recipe.prep_time_minutes} mins</p>}
        {recipe.cook_time_minutes && <p><strong>Cook Time:</strong> {recipe.cook_time_minutes} mins</p>}
        {recipe.servings && <p><strong>Servings:</strong> {recipe.servings}</p>}
      </div>

      {/* RatingStars Component */}
      <RatingStars
        recipeId={recipe.id}
        avgRating={recipe.avg_rating}
        currentUserRating={recipe.current_user_rating}
      />

      <p style={{ marginBottom: '1rem' }}><strong>By:</strong> <Link to={`/users/${recipe.user.id}`} style={{ color: '#007bff', textDecoration: 'none' }}>{recipe.user.username}</Link></p>

      {recipe.categories && recipe.categories.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <strong>Categories:</strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
            {recipe.categories.map(cat => (
              <span key={cat.id} style={{ background: '#e9ecef', padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.9em' }}>{cat.name}</span>
            ))}
          </div>
        </div>
      )}

      {recipe.tags && recipe.tags.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <strong>Tags:</strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
            {recipe.tags.map(tag => (
              <span key={tag.id} style={{ background: '#fff3cd', padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.9em', border: '1px solid #ffeaa7' }}>{tag.name}</span>
            ))}
          </div>
        </div>
      )}

      {isOwner && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #eee', display: 'flex', gap: '1rem' }}>
          <Link to={`/recipes/${recipe.id}/edit`} style={{ textDecoration: 'none' }}>
            <button style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Edit Recipe</button>
          </Link>
          <button onClick={handleDelete} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>
            Delete Recipe
          </button>
        </div>
      )}

      {/* CommentList Component */}
      <CommentList recipeId={recipe.id} initialComments={recipe.comments} />
    </div>
  );
};

export default RecipeDetailPage;