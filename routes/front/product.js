const express = require('express');
const frontProductController = require('../../controllers/front/product');
const router = express.Router();

// GET /front/product/products
router.get('/products', frontProductController.getProducts);

// GET /front/product/product/:productId
router.get('/product/:productId', frontProductController.getProduct);

module.exports = router;