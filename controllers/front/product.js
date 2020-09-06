const Product = require('../../models/product');

exports.getProducts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    try {
        const totalItems = await Product.find().countDocuments();
        const products = await Product.find()
            .populate('brand')
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
        const product = await Product.findById(productId).populate('brand');
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
