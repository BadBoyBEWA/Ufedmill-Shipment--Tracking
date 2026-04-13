const express = require('express');
const router = express.Router();
const { login, logout, refresh, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { loginRateLimiter } = require('../middleware/rateLimit');
const { loginValidation } = require('../middleware/validation');

router.post('/login', loginRateLimiter, loginValidation, login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', requireAuth, getMe);

module.exports = router;
