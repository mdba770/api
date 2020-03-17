const {validationResult} = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');


exports.getUsers = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    try {
        const totalItems = await User.find().countDocuments();
        const users = await User.find()
            .populate('role')
            .sort({createdAt: -1})
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        
            res.status(200).json({
                message: 'Fetched users successfully.',
                users: users,
                totalItems: totalItems
            });
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // const error = new Error('Validation failed.');
            const error = new Error(errors.array()[0].msg);
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const email = req.body.email;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const password = req.body.password;
        const role = req.body.role;
    
        const hashedPw = await bcrypt.hash(password, 12);
        
        const user = new User({
            email: email,
            password: hashedPw,
            firstName: firstName,
            lastName: lastName,
            role: role
        });
        const result = await user.save();
        
            res.status(201).json({
                message: 'User created.',
                user: result
            });
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    };
};