const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const sellerCheck = require('../middleware/sellerCheck');
const { addProduct, deleteProduct, editProduct } = require('../controllers/adminController');
const Product = require('../models/Product');

// Route to display dashboard page
router.get('/', verifyToken, sellerCheck, async (req, res) => {
    if (!req.isAuthenticated) {
        return res.redirect('/auth/login');
    }
    try {
        // Ensure the user is a seller
        if (!req.user.isSeller) {
            return res.status(403).send('Access denied. Only sellers can access this page.');
        }

        // Fetch the products that belong to the authenticated seller
        const products = await Product.find({ sellerId: req.user._id, isDeleted: false });
        // console.log(products);

        // Render the seller's dashboard and pass the seller's products to the template
        res.render('seller/dashboard', {
            isAuthenticated: req.isAuthenticated,
            user: req.user,
            products: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Route to render the add product form
router.get('/addProduct', verifyToken, sellerCheck, (req, res) => {
    if (!req.isAuthenticated) {
        res.redirect('/auth/login');
    } else {
        res.render('seller/addProduct', {
            isAuthenticated: req.isAuthenticated,
            user: req.user,
        });
    }
});

router.get('/editProduct/:productId', verifyToken, sellerCheck, async (req, res) => {
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
            res.render('seller/editProduct', {
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
