const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add or update item in the cart
const addToCart = async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    // console.log(userId, productId, quantity);

    try {
        // Find the user's cart
        let cart = await Cart.findOne({ userId });

        const actualProduct = await Product.findById(productId);

        if (!actualProduct) {
            return res.json({ message: 'Product Out Of Stock' });
        }

        if (cart) {
            // Check if the product already exists in the cart
            const existingProduct = cart.products.find(item => item.productId.toString() === productId);

            if (existingProduct) {
                // If product exists, update the quantity
                existingProduct.quantity = parseInt(existingProduct.quantity) + parseInt(quantity); // Increment quantity
            } else {
                // If product does not exist, add it to the cart
                cart.products.push({ productId, quantity });
            }

            // Save the updated cart
            await cart.save();
        } else {
            // If no cart exists, create a new cart
            cart = new Cart({ userId, products: [{ productId, quantity }] });
            await cart.save();
        }

        res.status(200).json({ message: 'Product added to cart successfully', cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get cart items
const getCart = async (req, res) => {
    if (!req.isAuthenticated) return res.redirect('/auth/login');

    const userId = req.user._id;

    // Check if the user is an admin or seller
    if (req.user.isAdmin) {
        return res.redirect('/admin'); // Redirect to admin dashboard
    } else if (req.user.isSeller) {
        return res.redirect('/seller'); // Redirect to seller dashboard
    }

    const cart = await Cart.findOne({ userId }).populate('products.productId'); // Populate product details

    // console.log(cart.products);

    res.render('products/cart', {
        isAuthenticated: req.isAuthenticated,
        user: req.user,
        cart: cart?.products || [],
    });
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    if (!req.isAuthenticated) return res.redirect('/auth/login');

    const userId = req.user._id;
    const { productId } = req.body;

    // console.log(userId, productId);

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Filter out the product to remove it
        cart.products = cart.products.filter(item => item.productId.toString() !== productId);

        await cart.save();

        res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update quantity in cart
const updateQuantity = async (req, res) => {
    const userId = req.user._id;
    const { productId, update } = req.body;

    // console.log(userId, productId, update);

    try {
        const cart = await Cart.findOne({ userId });

        const actualProduct = await Product.findById(productId);
        // console.log(actualProduct);
        if (!actualProduct || actualProduct.isDeleted) {
            return res.json({ message: 'Product Out Of Stock' });
        }

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const product = cart.products.find(item => item.productId.toString() === productId);

        if (update === 'increment') {
            if (parseInt(product.quantity) + 1 <= actualProduct.stock)
                product.quantity = parseInt(product.quantity) + 1;
            else
                return res.status(200).json({ message: 'Do not have enough stock' });
        } else if (update === 'decrement') {
            if (parseInt(product.quantity) - 1 > 0)
                product.quantity = parseInt(product.quantity) - 1;
            else
                return res.status(200).json({ message: 'Quantity can not be less than 1' });
        }
        // console.log(product.quantity);

        await cart.save();

        res.status(200).json({ message: 'Quantity updated' });
    } catch (error) {
        console.error('Error updating from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    updateQuantity,
};
