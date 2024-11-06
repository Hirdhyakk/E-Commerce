const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create the uploads/user directory if it doesn't exist
const userDir = './uploads/user';
if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, userDir);
    },
    filename: function (req, file, cb) {
        const userId = req.params.userId; // Get the user ID from the URL
        const extension = path.extname(file.originalname); // Get the file extension

        // Log userId to verify it is available
        console.log("User ID:", userId);
        console.log(extension);

        if (!userId) {
            return cb(new Error('User ID is required')); // Handle case when userId is not provided
        }
        cb(null, `${userId}.jpg`); // Save the file with the user ID as the name
    }
});

// File filter to allow only .jpg files
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg'];
    const fileMimeType = file.mimetype;

    if (!allowedMimeTypes.includes(fileMimeType)) {
        return cb(new Error('Only JPG images are allowed!'), false); // Reject file
    }

    cb(null, true); // Accept the file
};

// Configure multer upload with storage and fileFilter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// Export the multer upload middleware for use in the router
module.exports = upload;
