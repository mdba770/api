const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    shortDescription: {
        type: String,
        required: false
    },
    thumbnail: {
        type: String,
        required: false
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Brand', brandSchema);