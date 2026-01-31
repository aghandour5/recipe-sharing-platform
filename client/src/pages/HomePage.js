import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RecipeList from '../components/RecipeList';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <h1>Welcome to the Recipe Sharing Platform!</h1>
      <p>Discover and share amazing recipes.</p>
      {isAuthenticated && (
        <p>
          <Link to="/recipes/new">
            <button>Create Your First Recipe</button>
          </Link>
        </p>
      )}
      <hr />
      <h2>Latest Recipes</h2>
      <RecipeList />
    </div>
  );
};

export default HomePage;