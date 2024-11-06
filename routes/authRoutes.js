const express = require('express');
const router = express.Router();
const { signup, verifySignup, login, resetPass, submitNewPassword } = require('../controllers/authController');

// Render Signup Page
router.get('/signup', (req, res) => {
    res.render('auth/signup'); // Updated path
});

// Render Verify Signup Page
router.get('/signup/verify', (req, res) => {
    res.render('auth/verifySignup'); // Updated path
});

// Render Login Page
router.get('/login', (req, res) => {
    res.render('auth/login'); // Updated path
});

// Logout route
router.get('/logout', (req, res) => {
    // Clear the JWT token by clearing cookies
    res.clearCookie('token'); // Assuming the JWT is stored in a cookie named 'token'
    res.redirect('/auth/login'); // Redirect to the login page or homepage
});

// Reset Password Route
router.get('/reset-password/:resetToken', (req, res) => {
    const {resetToken} = req.params;
    // console.log(resetToken);
    res.render('auth/resetPass', { resetToken });
});


// Routes for signup and verification
router.post('/signup', signup);
router.post('/signup/verify', verifySignup);
router.post('/login', login);

// Route for sending the password reset email
router.post('/reset-password', resetPass);

// Route for submitting the new password
router.post('/reset-password/:resetToken', submitNewPassword);


module.exports = router;
