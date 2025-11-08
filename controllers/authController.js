const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const crypto = require('crypto');
const { generateToken } = require('../utils/jwtUtils');
const userStore = new Map();
const otpStore = new Map();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465
  auth: {
    user: "hirdhyak@gmail.com",
    pass: "illfrephvgqdqptz", // App password, not your Gmail password
  },
  tls: {
    rejectUnauthorized: false, // helps if Render's network causes SSL issues
  },
  connectionTimeout: 20000, // 20s
});


// Generate OTP function
function generateOTP(length = 6) {
    let otp = '';
    const digits = '0123456789';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}

// Signup function
const signup = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        // console.log(name, email, password, role);

        if (!email || !password || !name || !role) {
            return res.status(400).json({ message: 'Name, email, password, and role are required' });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({
                message: 'User already exists. Please login instead.',
                redirect: '/auth/login',
            });
        }

        const otp = generateOTP();
        const timeOut = Date.now() + (2 * 60 * 1000);
        otpStore.set(email, { otp, timeOut });
        userStore.set(email, { name, password, role });

        // console.log(otpStore, userStore);

        const mailOptions = {
            from: 'hirdhyak@gmail.com',
            to: email,
            subject: 'Your OTP for Signup',
            text: `Hello,\n\nThank you for signing up!\n\nYour OTP (One-Time Password) is **${otp}**. Please use this code to complete your signup process.\n\nThis OTP is valid for the next 2 minutes. If you did not request this code, please ignore this email.\n\nBest regards,\nE-commerce`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent successfully', redirect: '/auth/signup/verify' });
    } catch (error) {
        // console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Verify function
const verifySignup = async (req, res) => {
    const { email, otp } = req.body;

    const otpObj = otpStore.get(email);
    const userDetails = userStore.get(email);

    console.log(otpObj, userDetails);

    // Validate input fields
    if (!email || !otp) {
        return res.status(400).json({
            message: 'Email and OTP are required.',
            redirect: '/auth/signup',
        });
    }

    // Check if the user has changed the email
    if (!userDetails) {
        return res.status(400).json({
            message: 'Email does not match the one used for OTP generation.',
            redirect: '/auth/signup',
        });
    }

    if (!otpObj) {
        return res.status(400).json({
            message: 'No OTP found for this email.',
            redirect: '/auth/signup',
        });
    }

    if (otpObj && otpObj.timeOut < Date.now()) {
        otpStore.delete(email);
        userStore.delete(email);

        return res.status(400).json({
            message: 'OTP Expired',
            redirect: '/auth/signup',
        });
    }

    if (otpObj.otp === otp) {
        try {
            // Check if the user already exists
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({
                    message: 'User already exists. Please login instead.',
                    redirect: '/auth/login',
                });
            }

            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(userDetails.password, 10); // 10 is the salt rounds

            // Create a new user instance
            const newUser = new User({
                name: userDetails.name,
                email,
                password: hashedPassword,
                isSeller: userDetails.role === 'seller',
            });

            // Save the user in the database
            await newUser.save();

            // Remove the OTP and user details from the temporary stores after verification
            otpStore.delete(email);
            userStore.delete(email);

            return res.status(200).json({
                message: 'Signup successful!',
                redirect: '/auth/login',
            });
        } catch (error) {
            // console.error('Error saving user: ', error);
            return res.status(500).json({ message: 'Error saving user in the database' });
        }
    } else {
        return res.status(400).json({
            message: 'Invalid OTP',
        });
    }
};

// Login function 
const login = async (req, res) => {
    const { email, password } = req.body;
    // console.log(email, password);

    if (!email || !password) {
        return res.status(400).json({
            message: 'Enter Email and Password.',
            redirect: '/auth/login',
        });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(400).json({
                message: 'Invalid Username or Password.',
                redirect: '/auth/login',
            });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid Username or Password.',
                redirect: '/auth/login',
            });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        return res.status(200).json({
            message: 'Login successful!',
            token,
            redirect: '/',
        });
    } catch (error) {
        // console.error('Error during login:', error);
        return res.status(500).json({
            message: 'Internal server error. Please try again later.',
        });
    }
};

// Password Reset
const resetPass = async (req, res) => {
    const email = req.body.email;
    // console.log(email);

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a password reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour expiration
        await user.save(); // Save the user with the reset token

        const resetLink = `https://e-commerce-vtfr.onrender.com/auth/reset-password/${resetToken}`;

        const mailOptions = {
            from: 'hirdhyak@gmail.com',
            to: email,
            subject: 'Password Reset',
            html: `<p>You requested a password reset.</p>
            <p>Click this <a href="${resetLink}">link</a> to set a new password.</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Reset password form submission handler
const submitNewPassword = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const resetToken = req.params.resetToken; // Retrieve the reset token from URL parameters

    // console.log(newPassword, confirmPassword, resetToken);

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const user = await User.findOne({
            resetToken: resetToken,
            resetTokenExpiration: { $gt: Date.now() }, // Check if token is still valid
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 is the salt rounds

        // Update the user's password
        user.password = hashedPassword; // You should hash the password here before saving
        user.resetToken = undefined; // Clear reset token
        user.resetTokenExpiration = undefined; // Clear expiration
        await user.save(); // Save the updated user

        res.status(200).json({ message: 'Password successfully updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    signup,
    verifySignup,
    login,
    resetPass,
    submitNewPassword,
};


