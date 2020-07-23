const Role = require('../models/role');
const User = require('../models/user');
const Permission = require('../models/permission');
// const ObjectId = require('mongoose').Types.ObjectId; 

module.exports = (req, res, next) => {
    const path = req.route.path;
    const method = req.method;
    
    let currentRole;

    User.findById(req.userId)
        .then(user => {
            if(!user) {
                return Role.findOne({name:"guest"});   
            }else{
                return user;
            }
        })
        .then(role => {
            if(!role) {
                const error = new Error('Could not find role.');
                error.statusCode = 404;
                throw error;
            }
            if(role.role){
                currentRole = role.role;
            }else{
                currentRole = role._id;
            }
            return Permission.findOne({role: currentRole, route: path, method: method, enabled: true});
        })
        .then(permission => {
            if(!permission){
                const error = new Error('User does not have permission for this operation.');
                error.statusCode = 401;
                error.errorCode = 1;
                throw error;
            }
            next();
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};