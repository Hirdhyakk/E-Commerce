const express = require('express');
const verifyToken = require('../middleware/auth')
const {
    addToCart,
    getCart,
    removeFromCart,
    updateQuantity,
} = require('../controllers/cartController');

const router = express.Router();

router.post('/add', verifyToken, addToCart); // Add product to cart
router.get('/', verifyToken, getCart); // Get cart items
router.delete('/remove', verifyToken, removeFromCart); // Remove item from cart
router.put('/update', verifyToken, updateQuantity); // Update item quantity in cart

module.exports = router;
