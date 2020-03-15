const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    },
    // model: {

    // },
    // route: {

    // }
}, {timestamps: true});

module.exports = mongoose.model('Role', roleSchema);