const express = require('express');
const {body} = require('express-validator');
const brandController = require('../controllers/brand');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

// GET /brand/brands
router.get('/brands', brandController.getBrands);

// GET /brand/brand/:brandId
router.get('/brand/:brandId', brandController.getBrand);

// POST /brand/brand
router.post('/brand', isAuth, [
    body('name')
        .isLength({min: 3})
        .trim()
], brandController.createBrand);

// PUT /brand/brand/:brandId
router.put('/brand/:brandId', isAuth, brandController.updateBrand);

module.exports = router;