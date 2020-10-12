const express = require('express');
const {body} = require('express-validator');
const categoryController = require('../controllers/category');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

// GET /category/categories
router.get('/categories', isAuth, categoryController.getCategories);

// GET /category/category/:categoryId
router.get('/category/:categoryId', isAuth, categoryController.getCategory);

// POST /category/category
router.post('/category', isAuth, categoryController.createCategory);

// PUT /category/category/:categoryId
router.put('/category/:categoryId', isAuth, categoryController.updateCategory);

module.exports = router;