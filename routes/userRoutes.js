const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');

// User Api Endpoints
router.post('/login', UsersController.login)
router.post('/register', UsersController.register)
router.post('/getUser', UsersController.getUser)




module.exports = router
