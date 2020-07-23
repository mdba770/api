const {validationResult} = require('express-validator');
const Permission = require('../models/permission');


exports.getPermissions = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    try {
        const totalItems = await Permission.find().countDocuments();
        const permissions = await Permission.find()
            .populate('role')
            .sort({resource: 1})
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        
            res.status(200).json({
                message: 'Fetched permissions successfully.',
                permissions: permissions,
                totalItems: totalItems
            });
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getPermissionsByRole = async (req, res, next) => {
    const currentRole = req.params.roleId;
    const currentPage = req.query.page || 1;
    const perPage = 10;
    try {
        const totalItems = await Permission.find({role: currentRole}).countDocuments();
        const permissions = await Permission.find({role: currentRole})
            // .populate('role')
            .sort({resource: 1})
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
            
            const permissionsByRole = permissions.reduce((accumulator, permission) => {
                accumulator[permission.resource] = (accumulator[permission.resource] || []).concat(permission);
                return accumulator;
            }, {});
            
            res.status(200).json({
                message: 'Fetched permissions by role successfully.',
                permissions: permissionsByRole,
                totalItems: totalItems
            });
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.createPermission = async (req, res, next) => {
    try {
        // const path = req.route.path; //originalUrl
        // const originalMethod = req.method;
        // console.log(path);
        // console.log(originalMethod);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }
        
        const resource = req.body.resource;
        const action = req.body.action;
        const role = req.body.role;
        const method = req.body.method;
        const route = req.body.route;
        const enabled = req.body.enabled;

        const permission = new Permission({
            resource: resource,
            action: action,
            role: role,
            method: method,
            route: route,
            enabled: enabled
        });
    
        await permission.save();

        res.status(201).json({
            message: 'Permission created successfully!',
            permission: permission
        });
    } catch (err) {
       if(!err.statusCode) {
            err.statusCode = 500;
       }
       next(err);
    }
};

exports.getPermission = async (req, res, next) => {
    const permissionId = req.params.permissionId;
    try {
        const permission = await Permission.findById(permissionId);
        if(!permission) {
            const error = new Error('Could not find permission.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Permission fetched.',
            permission: permission
        })
    } catch (err) {
       if(!err.statusCode) {
            err.statusCode = 500;
       }
       next(err);
    }
};

