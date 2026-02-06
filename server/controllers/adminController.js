const db = require('../config/db');

// @desc    Get system stats (counts)
// @route   GET /api/admin/stats
const getStats = async (req, res) => {
    try {
        const userCount = await db.query('SELECT COUNT(*) FROM users');
        const recipeCount = await db.query('SELECT COUNT(*) FROM recipes');
        const commentCount = await db.query('SELECT COUNT(*) FROM comments');

        res.json({
            users: parseInt(userCount.rows[0].count),
            recipes: parseInt(recipeCount.rows[0].count),
            comments: parseInt(commentCount.rows[0].count)
        });
    } catch (error) {
        console.error('Admin Stats Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const result = await db.query('SELECT id, username, email, created_at FROM users ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Get All Users Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
    try {
        await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all recipes
// @route   GET /api/admin/recipes
const getAllRecipes = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT r.id, r.title, r.created_at, u.username as author 
            FROM recipes r 
            JOIN users u ON r.user_id = u.id 
            ORDER BY r.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Get All Recipes Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a recipe (Admin)
// @route   DELETE /api/admin/recipes/:id
const deleteRecipe = async (req, res) => {
    try {
        await db.query('DELETE FROM recipes WHERE id = $1', [req.params.id]);
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Delete Recipe Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getStats,
    getAllUsers,
    deleteUser,
    getAllRecipes,
    deleteRecipe
};
