const express = require('express');
const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /user/users
router.get('/users', isAuth, userController.getUsers);

module.exports = router;