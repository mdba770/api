const fs = require('fs');
const path = require('path');
const {validationResult} = require('express-validator');
const Brand = require('../models/brand');

exports.getBrands = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    try {
        const totalItems = await Brand.find().countDocuments();
        const brands = await Brand.find()
            .populate('creator')
            .sort({createdAt: -1})
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        
            res.status(200).json({
                message: 'Fetched brands successfully.',
                brands: brands,
                totalItems: totalItems
            });
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getBrand = async (req, res, next) => {
    const brandId = req.params.brandId;
    try {
        const brand = await Brand.findById(brandId);
        if(!brand) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Brand fetched.',
            brand: brand
        })
    } catch (err) {
       if(!err.statusCode) {
            err.statusCode = 500;
       }
       next(err);
    }
};
  
exports.createBrand = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        const title = req.body.title;
        let description = '';
        if (req.body.description) {
            description = req.body.description;
        }
        let shortDescription = '';
        if (req.body.shortDescription) {
            shortDescription = req.body.shortDescription;
        }
        let thumbnail = '';
        if (req.file) {
            thumbnail = req.file.path;
        }

        const brand = new Brand({
            title: title,
            description: description,
            shortDescription: shortDescription,
            thumbnail: thumbnail,
            creator: req.userId
        });
    
        await brand.save();

        res.status(201).json({
            message: 'Brand created successfully!',
            brand: brand
        });
    } catch (err) {
       if(!err.statusCode) {
            err.statusCode = 500;
       }
       next(err);
    }
};

exports.updateBrand = async (req, res, next) => {
    try {
        const brandId = req.params.brandId;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        let thumbnail = req.body.thumbnail;
        const title = req.body.title;
        const description = req.body.description;
        const shortDescription = req.body.shortDescription;
        if(req.file) {
            thumbnail = req.file.path;
        }
        const brand = await Brand.findById(brandId);
    
        if(!brand) {
            const error = new Error('Could not find brand.');
            error.statusCode = 404;
            throw error;
        }

        if(thumbnail !== brand.thumbnail) {
            clearImage(brand.thumbnail);
        }

        brand.thumbnail = thumbnail;
        brand.title = title;
        brand.description = description;
        brand.shortDescription = shortDescription;

        const result = await  brand.save();
        
        res.status(200).json({
            message: 'Brand updated!',
            brand: result
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