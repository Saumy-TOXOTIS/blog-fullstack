// server/controllers/userController.js
const User = require('../models/User');
const Post = require('../models/Post');

// Get logged-in user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('followers', 'username avatar') // Populate for counts if needed, or rely on virtuals
      .populate('following', 'username avatar');
      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Virtuals followerCount and followingCount should be available if schema is set correctly
    res.json(user); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  // ... (existing code for updateProfile, make sure avatar is handled if you allow direct URL update)
  const { username, email, bio, avatar } = req.body; // Include avatar
  try {
    const updateData = { username, email, bio };
    if (req.files && req.files.length > 0) {
      updateData.avatar = req.files[0].path;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

exports.deleteProfile = async (req, res) => {
  try {
    const userIdToDelete = req.userId;
    // Optional: Remove this user from other users' followers/following lists
    // This can be complex and resource-intensive. Consider if it's critical.
    // For now, we'll just delete the user. Their references in other lists will become dangling.
    // await User.updateMany({}, { $pull: { followers: userIdToDelete, following: userIdToDelete } });
    
    await Post.deleteMany({ author: userIdToDelete }); // Delete user's posts
    // Consider deleting user's comments and likes as well if desired

    await User.findByIdAndDelete(userIdToDelete);
    res.json({ message: 'Profile and associated data deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -__v'); // Virtuals should be included
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get any user's profile by ID (for public viewing)
exports.getUserProfile = async (req, res) => {
  try {
    const profileUser = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username avatar') // For counts and potential list display
      .populate('following', 'username avatar');

    if (!profileUser) return res.status(404).json({ error: 'User not found' });
    
    const posts = await Post.find({ author: req.params.id })
        .populate('author', 'username avatar') // Ensure avatar is populated for post author
        .populate('likes', 'username')
        .sort({ createdAt: -1 }); // Sort posts
    
    let isFollowing = false;
    if (req.userId) { // Check if a logged-in user is making the request
        const currentUser = await User.findById(req.userId);
        if (currentUser && currentUser.following.includes(profileUser._id)) {
            isFollowing = true;
        }
    }
    
    // Virtuals followerCount and followingCount will be on profileUser
    res.json({ 
        user: profileUser, 
        posts, 
        isFollowing // Add this flag
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};