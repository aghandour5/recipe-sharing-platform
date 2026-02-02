import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeCard from './RecipeCard';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for search and filter controls
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);

  const handleSearch = () => {
  setTriggerSearch(!triggerSearch);
};

  // State to hold options for dropdowns
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    // Fetch categories and tags for the filter dropdowns
    const fetchFilterOptions = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/tags'),
        ]);
        setCategories(catRes.data);
        setTags(tagRes.data);
      } catch (err) {
        console.error("Failed to fetch categories/tags for filters:", err);
      }
    };
    fetchFilterOptions();
  }, []);

useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        // Construct query parameters
        const params = new URLSearchParams();
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        if (selectedCategory) {
          params.append('category', selectedCategory);
        }
        if (selectedTag) {
          params.append('tag', selectedTag);
        }

        const response = await axios.get(`http://localhost:5000/api/recipes?${params.toString()}`);
        setRecipes(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [triggerSearch, selectedCategory, selectedTag]); // Re-fetch when any of these change

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTag('');
  };

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {/* Search and Filter Controls */}
      <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>Search & Filter Recipes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{ padding: '0.5rem' }}
          />
          <button onClick={handleSearch}>Search</button>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ flex: 1, padding: '0.5rem' }}
            >
              <option value="">-- All Categories --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              style={{ flex: 1, padding: '0.5rem' }}
            >
              <option value="">-- All Tags --</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={handleClearFilters} style={{ cursor: 'pointer' }}>
          Clear Filters
        </button>
      </div>

      {/* Recipe List */}
      <div className="recipe-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {recipes.length > 0 ? (
          recipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)
        ) : (
          <p>No recipes found matching your criteria. Try adjusting your search or filters!</p>
        )}
      </div>
    </div>
  );
};

export default RecipeList;