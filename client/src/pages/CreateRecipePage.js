import React from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';

const CreateRecipePage = () => {
  const navigate = useNavigate();

  const handleSave = (savedRecipe) => {
    console.log('Recipe saved:', savedRecipe);
    navigate(`/recipes/${savedRecipe.id}`); // Redirect to the new recipe's detail page
  };

  const handleCancel = () => {
    navigate('/'); // Redirect to home page
  };

  return (
    <div>
      <h1>Create a New Recipe</h1>
      <RecipeForm onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
};

export default CreateRecipePage;