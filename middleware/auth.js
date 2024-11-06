const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.isAuthenticated = false;
        return next();
    }

    try {
        // Verify the token with the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user information from the database using the decoded user ID
        const user = await User.findById(decoded.id).select('-password'); // Exclude the password field

        if (!user) {
            req.isAuthenticated = false;
            return next();
        }

        // Attach the user information (excluding password) to the request object
        req.user = user;
        req.isAuthenticated = true;
        next();
    } catch (error) {
        req.isAuthenticated = false;
        next();
    }
};

module.exports = verifyToken;
