const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getMyRecipes } = require('../controllers/recipeController');

router.use(protect); // All user routes are protected

router.get('/me/recipes', getMyRecipes); // This will be /api/users/me/recipes

module.exports = router;