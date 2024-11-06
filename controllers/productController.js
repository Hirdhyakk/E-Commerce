const User = require('../models/User');

// API to handle user photo upload and save path to MongoDB
const uploadUserPhoto = async (req, res) => {
  try {
    const userId = req.body.userId;
    const filePath = `/uploads/user/${userId}.jpg`;
    console.log(userId, filePath);

    // Find user and update their profile picture path
    const user = await User.findByIdAndUpdate(userId, { profilePicture: filePath }, { new: true });

    console.log(user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'File uploaded successfully', filePath });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error });
  }
};

module.exports = {
  uploadUserPhoto,
};
