const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    // slug: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    description: {
        type: String,
        required: false
    },
    shortDescription: {
        type: String,
        required: false
    },
    enabled: {
        type: Boolean,
        required: true,
        default: false
    },
    thumbnail: {
        type: String,
        required: false
    },
    quantity: {
        type: Number,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
        required: false
    },
    // offer: { type: Number },
    // pictures: [
    //     { img: { type: String } }
    // ],
    reviews: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'User' },
            review: { type: Number }
        }
    ],
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    },
}, {timestamps: true});

module.exports = mongoose.model('Product', productSchema);