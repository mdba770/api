const express = require('express');
const roleController = require('../controllers/role');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /role/roles
router.get('/roles', isAuth, roleController.getRoles);

// POST /role/role
router.post('/role', isAuth, roleController.createRole);

module.exports = router;