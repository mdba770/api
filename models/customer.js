const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
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
    country: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: false
    },
    cart: {
        items: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true }
            }
        ]
    }
}, {timestamps: true});

customerSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.product.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if(cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            product: product._id,
            quantity: newQuantity
        });
    }
    const updatedCart = { items: updatedCartItems };
    this.cart = updatedCart;
    return this.save()
    .then(customer => {
        return customer;
    })
    .catch(err => {
        console.log(err);
    })
}

customerSchema.methods.removeFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.product.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

customerSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
}

module.exports = mongoose.model('Customer', customerSchema);