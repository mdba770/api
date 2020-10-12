const {validationResult} = require('express-validator');
const Category = require('../models/category');
const slugify = require('slugify');

function setCategories(categories, parentId = null){
    const categoriesList = [];
    let category;
    if(parentId == null){
        category = categories.filter(cat => cat.parentId == undefined);
    }else{
        category = categories.filter(cat => cat.parentId == parentId);
    }
    for(let c of category){
        categoriesList.push({
            _id: c._id,
            name: c.name,
            slug: c.slug,
            children: setCategories(categories, c._id)
        });
    }
    return categoriesList;
}

exports.getCategories = async (req, res, next) => {
    try {
        const totalItems = await Category.find().countDocuments();
        const categories = await Category.find()
        const categoryList = setCategories(categories);
        res.status(200).json({
            message: 'Fetched categories successfully.',
            categories: categoryList,
            totalItems: totalItems
        });
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getCategory = async (req, res, next) => {
    const categoryId = req.params.categoryId;
    try {
        const category = await Category.findById(categoryId);
        if(!category) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Category fetched.',
            category: category
        })
    } catch (err) {
       if(!err.statusCode) {
            err.statusCode = 500;
       }
       next(err);
    }
};
  
exports.createCategory = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        const categoryObj = {
            name: req.body.name,
            slug: slugify(req.body.name),
            creator: req.userId
        };

        if (req.body.parentId) {
            categoryObj.parentId = req.body.parentId;
        }

        const category = new Category(categoryObj);
    
        await category.save();

        res.status(201).json({
            message: 'Category created successfully!',
            category: category
        });
    } catch (err) {
       if(!err.statusCode) {
            err.statusCode = 500;
       }
       next(err);
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }

        const category = await Category.findById(categoryId);
    
        if(!category) {
            const error = new Error('Could not find category.');
            error.statusCode = 404;
            throw error;
        }

        category.name = req.body.name;
        category.slug = slugify(req.body.name);
        if (req.body.parentId) {
            category.parentId = req.body.parentId;
        }

        const result = await  category.save();
        
        res.status(200).json({
            message: 'Category updated!',
            category: result
        });
    } catch (err) {
       if(!err.statusCode) {
            err.statusCode = 500;
       }
       next(err);
    };
};