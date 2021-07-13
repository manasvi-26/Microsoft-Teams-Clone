const express = require('express');
const router = express.Router();
const ConversationController = require('../controllers/conversation');
const auth = require('../middleware/checkAuth');

// Conversation Api Endpoints
router.post('/createConversation', auth, ConversationController.createConversation);
router.post('/addMessage', auth, ConversationController.addMessage);
router.post('/getAllConversations', ConversationController.getAllConversations);
router.post('/getConversation', ConversationController.getConversation);



module.exports = router
