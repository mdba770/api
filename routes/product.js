const express = require('express');
const {body} = require('express-validator');
const productController = require('../controllers/product');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

// GET /product/products
router.get('/products', isAuth, productController.getProducts);

// GET /product/product/:productId
router.get('/product/:productId', productController.getProduct);

// POST /product/product
router.post('/product', isAuth, [
    body('title')
        .isLength({min: 3})
        .trim()
], productController.createProduct);

module.exports = router;