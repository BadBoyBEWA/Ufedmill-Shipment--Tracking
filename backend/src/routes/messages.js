const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { requireAuth } = require('../middleware/auth');

// Public route for users to send messages from tracking page
router.post('/', messageController.sendMessage);

// Admin routes
router.get('/conversations', requireAuth, messageController.getConversations);
router.get('/:tracking_id', requireAuth, messageController.getMessages);
router.put('/:tracking_id/read', requireAuth, messageController.markAsRead);

module.exports = router;
