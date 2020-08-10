const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: false
    },
    // status: {
    //     type: String,
    //     default: ''
    // },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);