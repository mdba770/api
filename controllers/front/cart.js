const {validationResult} = require('express-validator');
const Product = require('../../models/product');
const Customer = require('../../models/customer');

exports.addToCart = async (req, res, next) => {
    try {
        const prodId = req.body.product;
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

        await customer.addToCart(product);

        const updatedCustomer = await Customer.findById(req.userId).populate('cart.items.product', 'title thumbnail price');

        res.status(200).json({
            message: 'Cart updated!!',
            customer: updatedCustomer
        });

    }catch (err) {
       if(!err.statusCode) {
            err.statusCode = 500;
       }
       next(err);
    };
};

exports.removeFromCart = async (req, res, next) => {
    try {
        const prodId = req.body.product;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error(errors.array()[0].msg);
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const customer = await Customer.findById(req.userId);
        if(!customer) {
            const error = new Error('Customer not found.');
            error.statusCode = 404;
            throw error;
        }

        await customer.removeFromCart(prodId);

        const updatedCustomer = await Customer.findById(req.userId).populate('cart.items.product', 'title thumbnail price');

        res.status(200).json({
            message: 'Product deleted from cart.',
            customer: updatedCustomer
        });

    }catch (err) {
       if(!err.statusCode) {
            err.statusCode = 500;
       }
       next(err);
    };
}