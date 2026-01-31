/*
Its primary job is to make sure that only the person who created the recipe can edit it.
If you try to edit someone else's recipe, this code blocks you.
*/

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecipeForm from '../components/RecipeForm';
import { useAuth } from '../contexts/AuthContext';

const EditRecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
        // 1. Fetch the data from the server
      try {
        const response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        const fetchedRecipe = response.data;
        // Check if the logged-in user is the owner of the recipe
        if (user && user.id === fetchedRecipe.user.id) {
          setRecipe(fetchedRecipe);
        } else {
          setError('You are not authorized to edit this recipe.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch recipe for editing');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, user]);

  const handleSave = (savedRecipe) => {
    console.log('Recipe updated:', savedRecipe);
    navigate(`/recipes/${savedRecipe.id}`); // Redirect to the recipe's detail page
  };

  const handleCancel = () => {
    navigate(`/recipes/${id}`); // Redirect back to the recipe's detail page
  };

  if (loading) return <p>Loading recipe...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!recipe) return <p>Recipe not found or you are not authorized to edit it.</p>;

  return (
    <div>
      <h1>Edit Recipe: {recipe.title}</h1>
      <RecipeForm recipe={recipe} onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
};

export default EditRecipePage;