const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
}, {timestamps: true});

module.exports = mongoose.model('Role', roleSchema);