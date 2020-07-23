const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
    resource: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    method: {
        type: String,
        enum: ['GET', 'POST', 'PUT', 'DELETE'],
        required: true
    },
    route: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        required: true,
        default: false
    }
}, {timestamps: true});

module.exports = mongoose.model('Permission', permissionSchema);
