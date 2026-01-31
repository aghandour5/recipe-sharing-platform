import React, { useState, useEffect } from 'react';
import axios from 'axios';

/*
1. recipe (Optional Object): If this prop is null or undefined, the form knows it is in "Create Mode".
If this prop contains data (e.g., {id: 1, title: 'Pizza'}), the form knows it is in "Edit Mode".
2. onSave (Function): A callback function passed from the parent. It tells the parent, "Hey, I'm done saving, here is the new data."
*/
const RecipeForm = ({ recipe, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    prep_time_minutes: '',
    cook_time_minutes: '',
    servings: '',
    image_url: '',
    category_ids: [],
    tag_ids: [],
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null); // New state for the file object
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // For previewing the selected image

  useEffect(() => {
    if (recipe) {
      setFormData({
        title: recipe.title || '',
        description: recipe.description || '',
        instructions: recipe.instructions || '',
        prep_time_minutes: recipe.prep_time_minutes || '',
        cook_time_minutes: recipe.cook_time_minutes || '',
        servings: recipe.servings || '',
        image_url: recipe.image_url || '',
        category_ids: recipe.categories?.map(c => c.id) || [],
        tag_ids: recipe.tags?.map(t => t.id) || [],
      });
    }
    // Fetch categories and tags for the form
    const fetchOptions = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/tags') // Assuming you have /api/tags endpoint
        ]);
        setCategories(catRes.data);
        setTags(tagRes.data);
      } catch (err) {
        console.error("Failed to fetch categories/tags:", err);
      }
    };
    fetchOptions();
  }, [recipe]);


  const handleChange = (e) => {
    const { name, value } = e.target; // Points to the <input name="title" ...> (variable 'name' gets "title") (variable 'value' gets whatever is typed)
    setFormData(prev => ({ ...prev, [name]: value })); // prev object is what the state looked like before you typed
  };                                // If name is the string "title", the code translates [name] to title.
  // If value is "P", the pair becomes title: "P".

  const handleCategoryChange = (e) => {
    const { options } = e.target;
    const selectedIds = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData(prev => ({ ...prev, category_ids: selectedIds }));
  };

  const handleTagChange = (e) => {
    const { options } = e.target;
    const selectedIds = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData(prev => ({ ...prev, tag_ids: selectedIds }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      // Clear the image_url field if a file is selected, as we're uploading now
      setFormData(prev => ({ ...prev, image_url: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = new FormData(); // Use FormData for file uploads
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('instructions', formData.instructions);
      if (formData.prep_time_minutes) payload.append('prep_time_minutes', formData.prep_time_minutes);
      if (formData.cook_time_minutes) payload.append('cook_time_minutes', formData.cook_time_minutes);
      if (formData.servings) payload.append('servings', formData.servings);

      if (imageFile) {
        payload.append('image', imageFile); // Append the file object
      } else if (formData.image_url) { // Fallback if using URL input instead of file upload
        payload.append('image_url', formData.image_url);
      }

      // Send arrays as JSON strings
      payload.append('category_ids', JSON.stringify(formData.category_ids));
      payload.append('tag_ids', JSON.stringify(formData.tag_ids));

      // Axios needs to know it's sending form data
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      let response;
      if (recipe) { // Editing
        response = await axios.put(`http://localhost:5000/api/recipes/${recipe.id}`, payload, config);
      } else { // Creating
        response = await axios.post('http://localhost:5000/api/recipes', payload, config);
      }
      onSave(response.data.recipe);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>{recipe ? 'Edit Recipe' : 'Create New Recipe'}</h2>
      <div>
        <label>Title:*</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </div>
      <div>
        <label>Instructions:*</label>
        <textarea name="instructions" value={formData.instructions} onChange={handleChange} required rows="5" />
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div>
          <label>Prep Time (mins):</label>
          <input type="number" name="prep_time_minutes" value={formData.prep_time_minutes} onChange={handleChange} />
        </div>
        <div>
          <label>Cook Time (mins):</label>
          <input type="number" name="cook_time_minutes" value={formData.cook_time_minutes} onChange={handleChange} />
        </div>
        <div>
          <label>Servings:</label>
          <input type="number" name="servings" value={formData.servings} onChange={handleChange} />
        </div>
      </div>
      <div>
        <label>Recipe Image:</label>
        <input type="file" name="image" onChange={handleImageChange} accept="image/*" />
        {imagePreviewUrl && (
          <img src={imagePreviewUrl} alt="Preview" style={{ maxWidth: '200px', marginTop: '1rem' }} />
        )}
        <p><strong>OR</strong></p>
        <label>Image URL (if not uploading a file):</label>
        <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="URL to an image" />
      </div>
      <div>
        <label>Categories (hold Ctrl/Cmd to select multiple):</label>
        <select
          name="category_ids"
          multiple
          value={formData.category_ids}
          onChange={handleCategoryChange}
          size={Math.min(5, categories.length)} // Show a few options
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Tags (hold Ctrl/Cmd to select multiple):</label>
        <select
          name="tag_ids"
          multiple
          value={formData.tag_ids}
          onChange={handleTagChange}
          size={Math.min(5, tags.length)} // Show a few options
        >
          {tags.map(tag => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (recipe ? 'Update Recipe' : 'Create Recipe')}
        </button>
      </div>
    </form>
  );
};

export default RecipeForm;