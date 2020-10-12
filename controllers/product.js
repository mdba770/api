const fs = require('fs');
const path = require('path');
const {validationResult} = require('express-validator');
const Product = require('../models/product');
const User = require('../models/user');

exports.getProducts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    try {
        const totalItems = await Product.find().countDocuments();
        const products = await Product.find()
            .populate('creator')
            .sort({createdAt: -1})
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        
            res.status(200).json({
                message: 'Fetched products successfully.',
                products: products,
                totalItems: totalItems
            });
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getProduct = async (req, res, next) => {
    const productId = req.params.productId;
    try {
        const product = await Product.findById(productId);
        if(!product) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Product fetched.',
            product: product
        })
    } catch (err) {
       if(!err.statusCode) {
            err.statusCode = 500;
       }
       next(err);
    }
};
  
exports.createProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }
        const productObj = {
            title: req.body.title,
            price: req.body.price,
            creator: req.userId
        }
        if(req.body.description !== null && req.body.description !== 'undefined'){
            productObj.description = req.body.description;
        }
        if(req.body.shortDescription !== null && req.body.shortDescription !== 'undefined'){
            productObj.shortDescription = req.body.shortDescription;
        }
        if(req.body.enabled !== null && req.body.enabled !== 'undefined'){
            productObj.enabled = req.body.enabled;
        }
        if(req.body.quantity !== null && req.body.quantity !== 'undefined'){
            productObj.quantity = req.body.quantity;
        }
        if(req.body.brand !== null && req.body.brand !== 'undefined'){
            productObj.brand = req.body.brand;
        }
        if (req.file) {
            productObj.thumbnail = req.file.path;
        }

        const product = new Product(productObj);
    
        await product.save();
            const user = await User.findById(req.userId);
            user.products.push(product);
        await user.save();

        res.status(201).json({
            message: 'Product created successfully!',
            product: product,
            creator: {
                _id: user._id,
                firstName: user.firstName
            }
        });
    } catch (err) {
       if(!err.statusCode) {
            err.statusCode = 500;
       }
       next(err);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        const product = await Product.findById(productId);
    
        if(!product) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }

        if(req.file) {
            if(product.thumbnail !== null){
                clearImage(product.thumbnail);
            }
            product.thumbnail = req.file.path;
        }

        product.title = req.body.title;
        product.price = req.body.price;

        if(req.body.description !== null && req.body.description !== 'undefined'){
            product.description = req.body.description;
        }
        if(req.body.shortDescription !== null && req.body.shortDescription !== 'undefined'){
            product.shortDescription = req.body.shortDescription;
        }
        if(req.body.enabled !== null && req.body.enabled !== 'undefined'){
            product.enabled = req.body.enabled;
        }
        if(req.body.quantity !== null && req.body.quantity !== 'undefined'){
            product.quantity = req.body.quantity;
        }
        if (req.body.brand !== null && req.body.brand !== 'undefined') {
            product.brand = req.body.brand;
        }

        const result = await  product.save();
        
        res.status(200).json({
            message: 'Product updated!',
            product: result
        });
    } catch (err) {
       if(!err.statusCode) {
            err.statusCode = 500;
       }
       next(err);
    };
};

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};