const User = require('../models/user');


exports.getUsers = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    try {
        const totalItems = await User.find().countDocuments();
        const users = await User.find()
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