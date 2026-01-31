const express = require('express');
const router = express.Router();
const { getTags } = require('../controllers/tagController');

// @route   GET /api/tags
router.route('/').get(getTags);

module.exports = router;