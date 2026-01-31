import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import RecipeCard from '../components/RecipeCard'; // Assuming RecipeCard can handle this
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        // Assuming the endpoint is /api/users/me/recipes
        const response = await axios.get('http://localhost:5000/api/users/me/recipes');
        setRecipes(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch your recipes');
      } finally {
        setLoading(false);
      }
    };
    if (user) { // Only fetch if user is logged in
      fetchMyRecipes();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (loading) return <p>Loading your recipes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Your Recipe Dashboard</h1>
      <p>Welcome back, {user.username}!</p>
      <p>
        <Link to="/recipes/new">
          <button>Create a New Recipe</button>
        </Link>
      </p>
      <hr />
      <h2>Your Recipes</h2>
      {recipes.length > 0 ? (
        <div className="recipe-list" style={{ display: 'flex', flexWrap: 'wrap' }}>
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <p>You haven't created any recipes yet. <Link to="/recipes/new">Create one now!</Link></p>
      )}
    </div>
  );
};

export default DashboardPage;