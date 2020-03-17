const {validationResult} = require('express-validator');
const Role = require('../models/role');


exports.getRoles = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    try {
        const totalItems = await Role.find().countDocuments();
        const roles = await Role.find()
            .sort({createdAt: -1})
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        
            res.status(200).json({
                message: 'Fetched roles successfully.',
                roles: roles,
                totalItems: totalItems
            });
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.createRole = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }
        
        const title = req.body.title;
        const description = req.body.description;
        const isActive = req.body.isActive;
        const role = new Role({
            title: title,
            description: description,
            isActive: isActive
        });
    
        await role.save();

        res.status(201).json({
            message: 'Role created successfully!',
            role: role
        });
    } catch (err) {
       if(!err.statusCode) {
            err.statusCode = 500;
       }
       next(err);
    }
};