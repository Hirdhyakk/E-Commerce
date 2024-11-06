const mongoose = require('mongoose');

// Snapshot of product details at the time of the order
const productItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['clothes', 'shoes', 'accessories', 'other'] // Same enum as in product schema
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
});

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User collection
        required: true
    },
    products: [productItemSchema],  // Array of product snapshots
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'Pending'  // Example: 'Pending', 'Shipped', 'Delivered'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
