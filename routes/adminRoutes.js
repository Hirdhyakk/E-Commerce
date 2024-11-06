const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const adminCheck = require('../middleware/adminCheck');
const { addProduct, deleteProduct, editProduct } = require('../controllers/adminController');
const Product = require('../models/Product');

// Route to display dashboard page
router.get('/', verifyToken, adminCheck, async (req, res) => {
    if (!req.isAuthenticated) {
        res.redirect('/auth/login');
    } else {
        try {
            // Fetch all products from the database
            const products = await Product.find({ isDeleted: false });

            // Render the dashboard and pass the products to the template
            res.render('admin/dashboard', {
                isAuthenticated: req.isAuthenticated,
                user: req.user,
                products: products
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ message: 'Error fetching products' });
        }
    }
});

// Route to render the add product form
router.get('/addProduct', verifyToken, adminCheck, (req, res) => {
    if (!req.isAuthenticated) {
        res.redirect('/auth/login');
    } else {
        res.render('admin/addProduct', {
            isAuthenticated: req.isAuthenticated,
            user: req.user,
        });
    }
});

router.get('/editProduct/:productId', verifyToken, adminCheck, async (req, res) => {
    const { productId } = req.params;
    // console.log(productId);
    if (!req.isAuthenticated) {
        res.redirect('/auth/login');
    } else {
        try {
            // Fetch product from the database
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Render the dashboard and pass the products to the template
            res.render('admin/editProduct', {
                isAuthenticated: req.isAuthenticated,
                user: req.user,
                product: product
            });
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ message: 'Error fetching product' });
        }
    }
});

// Route to add a product
router.post('/addProduct', verifyToken, addProduct);

// Route to delete a product
router.post('/deleteProduct/:productId', verifyToken, deleteProduct);

// Route to edit a product
router.post('/editProduct/:productId', verifyToken, editProduct);

module.exports = router;
