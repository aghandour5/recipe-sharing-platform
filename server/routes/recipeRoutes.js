const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  multerErrorHandler,
} = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

// Multer configuration for recipe routes (can be same as in app.js or specific)
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// All recipe routes below will require authentication

router.route('/')
  .get(getRecipes) // GET /api/recipes
  .post(protect, createRecipe, multerErrorHandler); // POST /api/recipes

router.route('/:id')
  .get(protect, getRecipeById) // GET /api/recipes/:id
  .put(protect, updateRecipe) // PUT /api/recipes/:id
  .delete(protect, deleteRecipe); // DELETE /api/recipes/:id

module.exports = router;