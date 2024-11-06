const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['clothes', 'shoes', 'accessories', 'other'], // Define product categories
        default: 'clothes',
    },
    price: {
        type: Number,
        required: true,
        min: 0, // Ensure price is non-negative
    },
    stock: {
        type: Number,
        required: true,
        min: 0, // Ensure stock is non-negative
    },
    imageUrl: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
    isDeleted: {
        type: Boolean,
        default: false, // Products are not deleted by default
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true, // Ensure that a product must have a seller
    },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
