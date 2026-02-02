const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // "Save pictures in the 'uploads' folder!"
    const uploadPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'recipe-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Initialize multer
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to delete old image
const deleteImage = (imageUrl) => {
  if (imageUrl && imageUrl.startsWith('/uploads/')) {
    const imagePath = path.join(__dirname, '..', imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
};

// Helper function to format recipe data for response
const formatRecipe = (recipe, user, categories = [], tags = [], avgRating = null) => {
  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    instructions: recipe.instructions,
    prep_time_minutes: recipe.prep_time_minutes,
    cook_time_minutes: recipe.cook_time_minutes,
    servings: recipe.servings,
    image_url: recipe.image_url,
    created_at: recipe.created_at,
    updated_at: recipe.updated_at,
    user: {
      id: user.id,
      username: user.username,
    },
    categories: categories.map(cat => ({ id: cat.id, name: cat.name })),
    tags: tags.map(tag => ({ id: tag.id, name: tag.name })),
    avg_rating: avgRating ? parseFloat(avgRating.avg_rating).toFixed(2) : null,
  };
};

/*
// Raw Data from Database:
categories: [{id: 5, name: "Dinner", created_at: "..."}, {id: 9, name: "Italian", created_at: "..."}]

// After Mapping (Cleaning it up):
categories: [
  { id: 5, name: "Dinner" },
  { id: 9, name: "Italian" }
]
*/

// @desc    Create a new recipe
// @route   POST /api/recipes
const createRecipe = [
  upload.single('image'),
  async (req, res) => {
    // 1. Parse standard fields
    const { title, description, instructions, prep_time_minutes, cook_time_minutes, servings, category_ids, tag_ids } = req.body;
    
    // 2. Handle the arrays (which are now strings)
    let parsedCategoryIds = [];
    let parsedTagIds = [];

    if (category_ids) {
      try {
        parsedCategoryIds = JSON.parse(category_ids);
      } catch (e) {
        console.error("Failed to parse category_ids", e);
      }
    }

    if (tag_ids) {
      try {
        parsedTagIds = JSON.parse(tag_ids);
      } catch (e) {
        console.error("Failed to parse tag_ids", e);
      }
    }

    const userId = req.user.id;
    let imageUrl = null;

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.image_url) {
      imageUrl = req.body.image_url;
    }

    if (!title || !instructions) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Title and instructions are required' });
    }

    try {
      const result = await db.query(
        `INSERT INTO recipes (title, description, instructions, prep_time_minutes, cook_time_minutes, servings, image_url, user_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [title, description, instructions, prep_time_minutes, cook_time_minutes, servings, imageUrl, userId]
      );
      const newRecipe = result.rows[0];

      if (parsedCategoryIds && parsedCategoryIds.length > 0) {
        // Map over the parsed numbers, not the string
        const categoryValues = parsedCategoryIds.map(catId => `('${newRecipe.id}', '${catId}')`).join(',');
        await db.query(`INSERT INTO recipe_categories (recipe_id, category_id) VALUES ${categoryValues}`);
      }

      if (parsedTagIds && parsedTagIds.length > 0) {
        const tagValues = parsedTagIds.map(tagId => `('${newRecipe.id}', '${tagId}')`).join(',');
        await db.query(`INSERT INTO recipe_tags (recipe_id, tag_id) VALUES ${tagValues}`);
      }
      
      const userResult = await db.query('SELECT id, username FROM users WHERE id = $1', [userId]);
      const user = userResult.rows[0];

      res.status(201).json({
        message: 'Recipe created successfully',
        recipe: formatRecipe(newRecipe, user)
      });
    } catch (error) {
      console.error('Create Recipe Error:', error);
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }
];

// @desc    Get all recipes (with optional pagination/filtering)
// @route   GET /api/recipes
const getRecipes = async (req, res) => {
  const { search, category, tag } = req.query; // Extract query parameters
  let query = `
    SELECT
      r.*, -- Select all recipe fields
      u.id as user_id, u.username as user_username, -- Select user fields
      COALESCE(AVG(rat.value), 0) as avg_rating
    FROM recipes r
    JOIN users u ON r.user_id = u.id -- Join with users to get user info
    LEFT JOIN ratings rat ON r.id = rat.recipe_id -- LEFT JOIN to include recipes with no ratings
  `;

  const conditions = []; // To hold WHERE conditions
  const queryParams = []; // To hold parameterized query values
  let paramIndex = 1; // For parameterized queries

  // --- Search Logic ---
  if (search) { // If a search term is provided
    conditions.push(`r.title ILIKE $${paramIndex++}`); // ILIKE for case-insensitive search
    queryParams.push(`%${search}%`); // Use % for wildcard matching
  }

  // --- Category Filter Logic ---
  if (category) {
    // We need to join with recipe_categories and categories if a category filter is applied
    query += ` JOIN recipe_categories rc ON r.id = rc.recipe_id JOIN categories c ON rc.category_id = c.id `; // Join to filter by category
    conditions.push(`c.id = $${paramIndex++}`);
    queryParams.push(category);
  }

  // --- Tag Filter Logic ---
  if (tag) {
    // Similarly, join with recipe_tags and tags if a tag filter is applied
    query += ` JOIN recipe_tags rt ON r.id = rt.recipe_id JOIN tags t ON rt.tag_id = t.id `;
    conditions.push(`t.id = $${paramIndex++}`);
    queryParams.push(tag);
  }

  // --- Assemble WHERE clause ---
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ` GROUP BY r.id, u.id, u.username ORDER BY r.created_at DESC`;

  try {
    console.log("Executing Query:", query); // For debugging
    console.log("With Params:", queryParams); // For debugging
    const result = await db.query(query, queryParams);

    const recipes = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      image_url: row.image_url,
      created_at: row.created_at,
      avg_rating: parseFloat(row.avg_rating).toFixed(2),
      user: { id: row.user_id, username: row.user_username }
    }));

    res.status(200).json(recipes);
  } catch (error) {
    console.error('Get Recipes Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single recipe by ID
// @route   GET /api/recipes/:id
const getRecipeById = async (req, res) => {
  try {
    const recipeResult = await db.query('SELECT * FROM recipes WHERE id = $1', [req.params.id]);
    const recipe = recipeResult.rows[0];

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const userResult = await db.query('SELECT id, username FROM users WHERE id = $1', [recipe.user_id]);
    const user = userResult.rows[0];

    const categoriesResult = await db.query(`
      SELECT c.id, c.name FROM categories c
      JOIN recipe_categories rc ON c.id = rc.category_id
      WHERE rc.recipe_id = $1
    `, [req.params.id]);
    const categories = categoriesResult.rows;

    const tagsResult = await db.query(`
      SELECT t.id, t.name FROM tags t
      JOIN recipe_tags rt ON t.id = rt.tag_id
      WHERE rt.recipe_id = $1
    `, [req.params.id]);
    const tags = tagsResult.rows;
    
    const avgRatingResult = await db.query(
      'SELECT COALESCE(AVG(value), 0) as avg_rating FROM ratings WHERE recipe_id = $1',
      [req.params.id]
    );
    const avgRating = avgRatingResult.rows[0];

    res.status(200).json(formatRecipe(recipe, user, categories, tags, avgRating));
  } catch (error) {
    console.error('Get Recipe By ID Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
const updateRecipe = [
  upload.single('image'), // Middleware to handle image upload
  async (req, res) => {
    const { title, description, instructions, prep_time_minutes, cook_time_minutes, servings, image_url, category_ids = [], tag_ids = [] } = req.body;
    const userId = req.user.id;

    //
    try {
      // Check if recipe exists and belongs to the user
      const recipeCheck = await db.query('SELECT * FROM recipes WHERE id = $1 AND user_id = $2', [req.params.id, userId]);
      const existingRecipe = recipeCheck.rows[0];

      if (!existingRecipe) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        /*
        Many apps deliberately return 404 even when it’s actually “unauthorized” so you don’t leak information like:
        “Yes this recipe exists, but you can’t touch it.”
        */
        return res.status(404).json({ message: 'Recipe not found or you are not authorized to update it' });
      }

      let newImageUrl = existingRecipe.image_url;

      // Handle image upload or URL change
      if (req.file) { // req.file exists only if the user uploaded a file (via multer upload.single('image'))
        newImageUrl = `/uploads/${req.file.filename}`;
        // Delete old image if it was an uploaded file
        if (existingRecipe.image_url && existingRecipe.image_url.startsWith('/uploads/')) {
          deleteImage(existingRecipe.image_url);
        }
      } else if (image_url !== existingRecipe.image_url) {
        // Handle external image URL change
        newImageUrl = image_url;
        // Delete old image if it was an uploaded file
        if (existingRecipe.image_url && existingRecipe.image_url.startsWith('/uploads/')) {
          deleteImage(existingRecipe.image_url);
        }
      }

      // Parse category_ids and tag_ids from JSON strings
      let parsedCategoryIds = [];
      let parsedTagIds = [];

      if (category_ids) {
        try {
          parsedCategoryIds = JSON.parse(category_ids);
        } catch (e) {
          console.error("Failed to parse category_ids", e);
        }
      }

      if (tag_ids) {
        try {
          parsedTagIds = JSON.parse(tag_ids);
        } catch (e) {
          console.error("Failed to parse tag_ids", e);
        }
      }
      //

      const updateFields = [];
      const updateValues = [];
      let paramIndex = 1;

      if (title !== undefined) { updateFields.push(`title = $${paramIndex++}`); updateValues.push(title); }
      if (description !== undefined) { updateFields.push(`description = $${paramIndex++}`); updateValues.push(description); }
      if (instructions !== undefined) { updateFields.push(`instructions = $${paramIndex++}`); updateValues.push(instructions); }
      if (prep_time_minutes !== undefined) { updateFields.push(`prep_time_minutes = $${paramIndex++}`); updateValues.push(prep_time_minutes); }
      if (cook_time_minutes !== undefined) { updateFields.push(`cook_time_minutes = $${paramIndex++}`); updateValues.push(cook_time_minutes); }
      if (servings !== undefined) { updateFields.push(`servings = $${paramIndex++}`); updateValues.push(servings); }
      if (newImageUrl !== existingRecipe.image_url) { updateFields.push(`image_url = $${paramIndex++}`); updateValues.push(newImageUrl); }
      
      updateValues.push(req.params.id);
      updateValues.push(userId);

      let updatedRecipe;
      if (updateFields.length > 0) {
        const updateQuery = `
          UPDATE recipes
          SET ${updateFields.join(', ')}, updated_at = NOW()
          WHERE id = $${paramIndex++} AND user_id = $${paramIndex++}
          RETURNING *`;
        const result = await db.query(updateQuery, updateValues);
        updatedRecipe = result.rows[0];
      } else {
        const result = await db.query('SELECT * FROM recipes WHERE id = $1', [req.params.id]);
        updatedRecipe = result.rows[0];
      }

      // Update category associations
      await db.query('DELETE FROM recipe_categories WHERE recipe_id = $1', [req.params.id]);
      if (parsedCategoryIds && parsedCategoryIds.length > 0) {
        const categoryValues = parsedCategoryIds.map(catId => `('${req.params.id}', '${catId}')`).join(',');
        await db.query(`INSERT INTO recipe_categories (recipe_id, category_id) VALUES ${categoryValues}`);
      }

      // Update tag associations
      await db.query('DELETE FROM recipe_tags WHERE recipe_id = $1', [req.params.id]);
      if (parsedTagIds && parsedTagIds.length > 0) {
        const tagValues = parsedTagIds.map(tagId => `('${req.params.id}', '${tagId}')`).join(',');
        await db.query(`INSERT INTO recipe_tags (recipe_id, tag_id) VALUES ${tagValues}`);
      }
      
      const userResult = await db.query('SELECT id, username FROM users WHERE id = $1', [userId]);
      const user = userResult.rows[0];
      
      const categoriesResult = await db.query(`SELECT c.id, c.name FROM categories c JOIN recipe_categories rc ON c.id = rc.category_id WHERE rc.recipe_id = $1`, [req.params.id]);
      const categories = categoriesResult.rows;
      const tagsResult = await db.query(`SELECT t.id, t.name FROM tags t JOIN recipe_tags rt ON t.id = rt.tag_id WHERE rt.recipe_id = $1`, [req.params.id]);
      const tags = tagsResult.rows;
      const avgRatingResult = await db.query('SELECT COALESCE(AVG(value), 0) as avg_rating FROM ratings WHERE recipe_id = $1', [req.params.id]);
      const avgRating = avgRatingResult.rows[0];

      res.status(200).json({
        message: 'Recipe updated successfully',
        recipe: formatRecipe(updatedRecipe, user, categories, tags, avgRating)
      });
    } catch (error) {
      console.error('Update Recipe Error:', error);
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }
];

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
const deleteRecipe = async (req, res) => {
  const userId = req.user.id;

  try {
    const recipeCheck = await db.query('SELECT * FROM recipes WHERE id = $1 AND user_id = $2', [req.params.id, userId]);
    const existingRecipe = recipeCheck.rows[0];

    if (!existingRecipe) {
      return res.status(404).json({ message: 'Recipe not found or you are not authorized to delete it' });
    }

    if (existingRecipe.image_url && existingRecipe.image_url.startsWith('/uploads/')) {
      deleteImage(existingRecipe.image_url);
    }

    await db.query('DELETE FROM recipes WHERE id = $1 AND user_id = $2', [req.params.id, userId]);

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete Recipe Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get current user's recipes
// @route   GET /api/users/me/recipes
const getMyRecipes = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await db.query(`
      SELECT
        r.*,
        u.id as user_id, u.username as user_username,
        COALESCE(AVG(rat.value), 0) as avg_rating
      FROM recipes r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN ratings rat ON r.id = rat.recipe_id
      WHERE r.user_id = $1
      GROUP BY r.id, u.id, u.username
      ORDER BY r.created_at DESC
    `, [userId]); // Crucial: It is a LEFT JOIN (not INNER) so that recipes with zero ratings are still included in the results.
    
    const recipes = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      image_url: row.image_url,
      created_at: row.created_at,
      avg_rating: parseFloat(row.avg_rating).toFixed(2),
      user: { id: row.user_id, username: row.user_username }
    }));
    res.status(200).json(recipes);
  } catch (error) {
    console.error('Get My Recipes Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Error handling middleware for multer
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size is too large. Maximum size is 5MB.' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected file field.' });
    }
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

module.exports = {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  multerErrorHandler,
  getMyRecipes,
  upload
};