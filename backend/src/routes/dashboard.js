const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const { requireAuth } = require('../middleware/auth');

router.get('/stats', requireAuth, getStats);

module.exports = router;
