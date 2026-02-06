const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, deleteUser, getAllRecipes, deleteRecipe } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { protectAdmin } = require('../middleware/adminMiddleware');

// All routes are protected and require admin privileges
router.use(protect);
router.use(protectAdmin);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/recipes', getAllRecipes);
router.delete('/recipes/:id', deleteRecipe);

module.exports = router;
