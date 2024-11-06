const express = require('express');
const verifyToken = require('../middleware/auth');
const {
    createOrder,
    getUserOrders,
    updateOrderStatus,
    getOrderById
} = require('../controllers/orderController');

const router = express.Router();

// Route to create a new order
router.post('/createOrder', verifyToken, createOrder);

// Route to get all orders for a specific user
router.get('/userOrders', verifyToken, getUserOrders);

// Route to update the status of an order
router.patch('/updateOrderStatus/:orderId', verifyToken, updateOrderStatus);

// Route to get the details of a specific order by orderId
router.get('/order/:orderId', verifyToken, getOrderById);

module.exports = router;
