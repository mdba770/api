const {validationResult} = require('express-validator');
const Product = require('../../models/product');
const Customer = require('../../models/customer');

exports.addToCart = async (req, res, next) => {
    try {
        const prodId = req.body.productId;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error(errors.array()[0].msg);
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const product = await Product.findById(prodId);
        if(!product) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }

        const customer = await Customer.findById(req.userId);
        if(!customer) {
            const error = new Error('Customer not found.');
            error.statusCode = 404;
            throw error;
        }

        const result = await customer.addToCart(product);
        res.status(200).json({
            message: 'Cart updated!!',
            customer: result
        });

    }catch (err) {
       if(!err.statusCode) {
            err.statusCode = 500;
       }
       next(err);
    };
};