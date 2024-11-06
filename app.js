require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.set('view engine', 'ejs');


// Routes
app.use('/auth', authRoutes); // Use the auth routes
app.use('/', productRoutes); // Normal Routes to display application content
app.use('/admin', adminRoutes); // Admin Routes to display administration content
app.use('/seller', sellerRoutes); // Seller Routes to display seller content
app.use('/cart', cartRoutes); // Cart Routes to handle cart options
app.use('/order', orderRoutes); // Order Routes to handle order options

// Connect to MongoDB (db.js will handle this)
const connectDB = require('./config/db');
connectDB(); // Call to connect to MongoDB

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});