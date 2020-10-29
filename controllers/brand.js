const fs = require('fs');
const path = require('path');
const {validationResult} = require('express-validator');
const Brand = require('../models/brand');
const slugify = require('slugify');

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
            // const error = new Error('Validation failed, entered data is incorrect.');
            const error = new Error(errors.array()[0].msg);
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const brandObj = {
            name: req.body.name,
            slug: slugify(req.body.name),
            creator: req.userId
        };
    
        if (req.body.description) {
            brandObj.description = req.body.description;
        }
        
        if (req.body.shortDescription) {
            brandObj.shortDescription = req.body.shortDescription;
        }
        
        if (req.file) {
            brandObj.thumbnail = req.file.path;
        }

        const brand = new Brand(brandObj);
    
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
        const name = req.body.name;
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
        brand.name = name;
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