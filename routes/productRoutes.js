const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const upload = require('../middleware/multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { uploadUserPhoto } = require('../controllers/productController');
const Product = require('../models/Product');
const User = require('../models/User');
const Cart = require('../models/Cart')

// Use the verifyToken middleware for the products route
router.get('/', verifyToken, async (req, res) => {
  const initialLimit = 5;
  const products = await Product.find({ isDeleted: false })
    .limit(initialLimit);

  // Fetch all products from the database
  // const products = await Product.find({ isDeleted: false });

  if (!req.isAuthenticated) {
    return res.render('products/index', {
      isAuthenticated: req.isAuthenticated, user: req.user,
      products: products, initialLimit: initialLimit
    });
  }

  // Check if the user is an admin or seller
  if (req.user.isAdmin) {
    return res.redirect('/admin'); // Redirect to admin dashboard
  } else if (req.user.isSeller) {
    return res.redirect('/seller'); // Redirect to seller dashboard
  }

  const userId = req.user._id;

  res.render('products/index', {
    isAuthenticated: req.isAuthenticated, user: req.user,
    products: products, initialLimit: initialLimit
  });
});

// Add pagination to fetch products in batches
router.get('/load-more', verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page, default to 1
  const limit = parseInt(req.query.limit) || 5; // Number of products per page, default to 5

  // Fetch products with pagination
  const products = await Product.find({ isDeleted: false })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalProducts = await Product.countDocuments({ isDeleted: false }); // Total number of products

  res.json({ products, totalProducts, currentPage: page });
});


router.get('/profile', verifyToken, (req, res) => {
  if (!req.isAuthenticated) return res.redirect('/auth/login');

  const userId = req.user._id;
  const userImagePath = path.join(__dirname, '..', 'uploads/user', `${userId}.jpg`);

  // Check if the file exists
  fs.access(userImagePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If file doesn't exist, use default image
      req.user.profilePicture = '/uploads/user/default-profile.jpg';
    } else {
      // Use the uploaded profile picture
      req.user.profilePicture = `/uploads/user/${userId}.jpg`;
    }

    // Render the profile with either the uploaded image or the default one
    res.render('products/profile', { isAuthenticated: req.isAuthenticated, user: req.user });
  });
});

// router.get('/cart', verifyToken, async (req, res) => {
//     if (!req.isAuthenticated) return res.redirect('/auth/login');

//     const userId = req.user._id;

//     // Check if the user is an admin or seller
//     if (req.user.isAdmin) {
//         return res.redirect('/admin'); // Redirect to admin dashboard
//     } else if (req.user.isSeller) {
//         return res.redirect('/seller'); // Redirect to seller dashboard
//     }

//     const cart = await Cart.findOne({ userId }).populate('products.productId'); // Populate product details

//     console.log(cart.products);

//     res.render('products/cart', {
//         isAuthenticated: req.isAuthenticated,
//         user: req.user,
//         cart: cart.products || []
//     });
// });

router.post('/uploadPhoto/:userId', upload.single('image'), uploadUserPhoto);

router.post('/changePassword', async (req, res) => {
  const { currentPassword, newPassword, userId } = req.body;

  console.log(currentPassword, newPassword, userId);

  try {
    // Fetch the user from the database by ID
    const user = await User.findById(userId);

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    // Hash the new password and update it in the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;
