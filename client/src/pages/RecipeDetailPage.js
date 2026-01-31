import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const RecipeDetailPage = () => {
  const { id } = useParams(); // This is a hook from react-router-dom. It looks at the URL address bar, and extracts the value of :id from the route /recipes/:id
  const [recipe, setRecipe] = useState(null); // It starts as null because we haven't fetched it from the server yet.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth(); // Custom hook to access auth context
  const navigate = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

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
    <div className="recipe-detail" style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h1>{recipe.title}</h1>
      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt={recipe.title}
          style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '4px', marginBottom: '1rem' }}
        />
      )}
      <p><strong>Description:</strong> {recipe.description}</p>
      <p><strong>Instructions:</strong></p>
      <pre style={{ whiteSpace: 'pre-wrap', background: '#f4f4f4', padding: '1rem', borderRadius: '4px' }}>{recipe.instructions}</pre>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {recipe.prep_time_minutes && <p><strong>Prep Time:</strong> {recipe.prep_time_minutes} mins</p>}
        {recipe.cook_time_minutes && <p><strong>Cook Time:</strong> {recipe.cook_time_minutes} mins</p>}
        {recipe.servings && <p><strong>Servings:</strong> {recipe.servings}</p>}
      </div>
      {recipe.avg_rating && <p><strong>Average Rating:</strong> {recipe.avg_rating} ⭐</p>}
      <p><strong>By:</strong> <Link to={`/users/${recipe.user.id}`}>{recipe.user.username}</Link></p>
      
      <div style={{ marginBottom: '1rem' }}>
        <strong>Categories:</strong>
        <ul>
          {recipe.categories.map(cat => <li key={cat.id}>{cat.name}</li>)}
        </ul>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <strong>Tags:</strong>
        <ul>
          {recipe.tags.map(tag => <li key={tag.id}>{tag.name}</li>)}
        </ul>
      </div>

      {isOwner && (
        <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
          <Link to={`/recipes/${recipe.id}/edit`} style={{ marginRight: '1rem' }}>
            <button>Edit Recipe</button>
          </Link>
          <button onClick={handleDelete} style={{ background: 'red', color: 'white' }}>
            Delete Recipe
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeDetailPage;