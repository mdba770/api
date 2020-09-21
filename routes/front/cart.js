const express = require('express');
const frontCartController = require('../../controllers/front/cart');
const router = express.Router();
const isAuth = require('../../middleware/is-auth');

// POST /front/cart/add-to-cart
router.put('/add-to-cart', isAuth, frontCartController.addToCart);

// POST /front/cart/delete-from-cart
router.put('/remove-from-cart', isAuth, frontCartController.removeFromCart);

module.exports = router;