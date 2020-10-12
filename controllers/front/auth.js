const { validationResult } = require('express-validator');
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../../models/customer');

exports.signup = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // const error = new Error('Validation failed.');
            const error = new Error(errors.array()[0].msg);
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const { email, firstName, lastName, password } = req.body;
        // const hashedPw = await bcrypt.hash(password, 12);
        const customer = new Customer({
            email,
            password,
            firstName,
            lastName
        });
        const result = await customer.save();
        const token = jwt.sign({
            email: result.email,
            userId: result._id.toString()
        }, process.env.JSONWEBTOKEN_, { expiresIn: '1h' });

        res.status(201).json({
            message: 'Customer created.',
            token: token,
            customer: {
                email: result.email,
                firstName: result.firstName,
                lastName: result.lastName,
                cart: result.cart
            }
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    };

};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const customer = await Customer.findOne({ email: email })
            .populate('cart.items.product', 'title thumbnail price');

        if (!customer) {
            const error = new Error('A customer with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }

        // const isEqual = await bcrypt.compare(password, customer.password);
        const isEqual = customer.authenticate(password);

        if (!isEqual) {
            const error = new Error('Wrong email or password.');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            email: customer.email,
            userId: customer._id.toString()
        }, process.env.JSONWEBTOKEN_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            token: token,
            customer: {
                email: customer.email,
                firstName: customer.firstName,
                lastName: customer.lastName,
                cart: customer.cart
            }
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getMe = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.userId)
            .populate('cart.items.product', 'title thumbnail price');
        if (!customer) {
            const error = new Error('Customer not found.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            customer: {
                email: customer.email,
                firstName: customer.firstName,
                lastName: customer.lastName,
                cart: customer.cart
            }
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
