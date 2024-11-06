const Product = require('../models/Product');

// Add new product
const addProduct = async (req, res) => {
    try {
        const { name, description, category, price, stock, imageUrl } = req.body;
        const sellerId = req.user.id;

        // Validate all fields
        if (!name || !description || !category || !price || !stock || !imageUrl) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new product
        const newProduct = new Product({
            name,
            description,
            category,
            price,
            stock,
            imageUrl,
            sellerId
        });

        // Save product to the database
        await newProduct.save();

        // Send success response
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product', error });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Find the product
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const sellerId = req.user.id;

        // Check if the logged-in user is the seller of the product
        if (!product.sellerId.equals(sellerId) && !req.user.isAdmin) {
            return res.status(403).json({ message: 'You are not authorized to delete this product' });
        }

        // Mark the product as deleted
        await Product.findByIdAndUpdate(productId, { isDeleted: true });

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
};

// Edit a product
const editProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const { name, description, category, price, stock, imageUrl } = req.body;

        // Validate all fields
        if (!name || !description || !category || !price || !stock || !imageUrl) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find product and ensure it belongs to the user
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const sellerId = req.user.id;

        // console.log(req.user);

        if (!product.sellerId.equals(sellerId) && !req.user.isAdmin) {
            return res.status(403).json({ message: 'You are not authorized to edit this product' });
        }

        // Update product details
        product.name = name;
        product.description = description;
        product.category = category;
        product.price = price;
        product.stock = stock;
        product.imageUrl = imageUrl;

        // Save updated product
        await product.save();

        // Send success response
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error });
    }
}

module.exports = {
    addProduct,
    deleteProduct,
    editProduct
};