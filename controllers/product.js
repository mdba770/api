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
        const thumbnail = req.file.path;
        const title = req.body.title;
        const description = req.body.description;
        const shortDescription = req.body.shortDescription;
        const enabled = req.body.enabled;
        const quantity = req.body.quantity;
        const price = req.body.price;

        const product = new Product({
            title: title,
            description: description,
            shortDescription: shortDescription,
            enabled: enabled,
            quantity: quantity,
            price: price,
            thumbnail: thumbnail,
            creator: req.userId
        });
    
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

        const thumbnail = req.body.thumbnail;
        const title = req.body.title;
        const description = req.body.description;
        const shortDescription = req.body.shortDescription;
        const enabled = req.body.enabled;
        const quantity = req.body.quantity;
        const price = req.body.price;
        if(req.file) {
            thumbnail = req.file.path;
        }
        const product = await Product.findById(productId);
    
        if(!product) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }

        if(thumbnail !== product.thumbnail) {
            clearImage(product.thumbnail);
        }
        
        product.thumbnail = thumbnail;
        product.title = title;
        product.description = description;
        product.shortDescription = shortDescription;
        product.enabled = enabled;
        product.quantity = quantity;
        product.price = price;

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