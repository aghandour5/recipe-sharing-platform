import React from 'react';
import { Link } from 'react-router-dom';

                // you can use recipe directly without writing props.recipe everywhere.
const RecipeCard = ({ recipe }) => {
  return (
    <div className="recipe-card" style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem', borderRadius: '8px' }}>
      {recipe.image_url /*truthy*/ && (
        <img
          src={recipe.image_url}
          alt={recipe.title}
          style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
        />
      )}
      <h3><Link to={`/recipes/${recipe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>{recipe.title}</Link></h3>
      <p>{recipe.description}</p>
      <p>By: {recipe.user.username}</p>
      {recipe.avg_rating && <p>Avg Rating: {recipe.avg_rating} ⭐</p>}
    </div>
  );
};

export default RecipeCard;