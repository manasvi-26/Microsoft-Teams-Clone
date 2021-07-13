const express = require('express');
const router = express.Router();
const TokenController = require('../controllers/token');

// Token Api Endpoints
router.get('/isTokenValid', TokenController.isTokenValid)

module.exports = router
