const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    hashPassword: {
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

customerSchema.virtual('password')
    .set(function(password) {
        this.hashPassword = bcrypt.hashSync(password, 12);
    }
);

customerSchema.methods.authenticate = function(password) {
    return bcrypt.compareSync(password, this.hashPassword);
}

customerSchema.methods.addToCart = function(product, quantity) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.product.toString() === product._id.toString();
    });
    let newQuantity = quantity;
    const updatedCartItems = [...this.cart.items];

    if(cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + newQuantity;
        if(newQuantity <= 0){
            return this.removeFromCart(product._id);
        }else{
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        }
        
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
    return this.save()
    .then(customer => {
        return customer;
    })
    .catch(err => {
        console.log(err);
    })
}

customerSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
}

module.exports = mongoose.model('Customer', customerSchema);