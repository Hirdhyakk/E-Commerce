const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isSeller: {
        type: Boolean,
        default: false,
    },
    profilePicture: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetToken: {
        type: String,
        default: undefined,
    },
    resetTokenExpiration: {
        type: Date,
    }
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
