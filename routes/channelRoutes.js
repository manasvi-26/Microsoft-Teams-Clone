const express = require('express');
const router = express.Router();
const ChannelController = require('../controllers/channel');
const auth = require('../middleware/checkAuth');

// Channel Api Endpoints
router.post('/createNewChannel', auth, ChannelController.createNewChannel);
router.post('/startMeet', auth, ChannelController.startMeet);
router.post('/endMeet', ChannelController.endMeet);
router.post('/getChannel', ChannelController.getChannel);


module.exports = router
