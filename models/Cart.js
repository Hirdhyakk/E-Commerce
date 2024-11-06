const mongoose = require('mongoose');

const productItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to User collection
        required: true
    },
    products: [productItemSchema]  // Array of product items
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
