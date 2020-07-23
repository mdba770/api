const {validationResult} = require('express-validator');
const Role = require('../models/role');


exports.getRoles = async (req, res, next) => {
    // const path = req.route.path; //originalUrl
    // const originalMethod = req.method;
    // console.log(path);
    // console.log(originalMethod);
    

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
        
        const name = req.body.name;
        const displayName = req.body.displayName;
        const description = req.body.description;
        const role = new Role({
            name: name,
            displayName: displayName,
            description: description
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

exports.getRole = async (req, res, next) => {
    // const path = req.route.path; //originalUrl
    // const originalMethod = req.method;
    // console.log(path);
    // console.log(originalMethod);

    const roleId = req.params.roleId;
    try {
        const role = await Role.findById(roleId);
        if(!role) {
            const error = new Error('Could not find role.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Role fetched.',
            role: role
        })
    } catch (err) {
       if(!err.statusCode) {
            err.statusCode = 500;
       }
       next(err);
    }
};