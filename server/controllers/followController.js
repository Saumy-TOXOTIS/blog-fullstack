// server/controllers/followController.js
const User = require('../models/User');
const mongoose = require('mongoose');
const createNotification = require('../utils/createNotification');

// Follow a user
exports.followUser = async (req, res) => {
    const userIdToFollow = req.params.userIdToFollow;
    const currentUserId = req.userId;

    if (userIdToFollow === currentUserId) {
        return res.status(400).json({ error: "You cannot follow yourself." });
    }

    try {
        const userToFollow = await User.findById(userIdToFollow);
        const currentUser = await User.findById(currentUserId);

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ error: "User not found." });
        }

        // Check if already following
        if (currentUser.following.includes(userIdToFollow)) {
            return res.status(400).json({ error: "You are already following this user." });
        }

        // Add to current user's following list
        currentUser.following.push(userIdToFollow);
        await currentUser.save();

        // Add to target user's followers list
        userToFollow.followers.push(currentUserId);
        await userToFollow.save();

        await createNotification(req.io, req.userSocketMap, {
            recipient: userIdToFollow,
            sender: currentUserId,
            type: 'follow',
        });

        res.status(200).json({ message: "Successfully followed user." });

    } catch (err) {
        console.error("Error following user:", err);
        res.status(500).json({ error: "Failed to follow user. " + err.message });
    }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
    const userIdToUnfollow = req.params.userIdToUnfollow;
    const currentUserId = req.userId;

    if (userIdToUnfollow === currentUserId) {
        return res.status(400).json({ error: "You cannot unfollow yourself." });
    }

    try {
        const userToUnfollow = await User.findById(userIdToUnfollow);
        const currentUser = await User.findById(currentUserId);

        if (!userToUnfollow || !currentUser) {
            return res.status(404).json({ error: "User not found." });
        }

        // Check if not following
        if (!currentUser.following.includes(userIdToUnfollow)) {
            return res.status(400).json({ error: "You are not following this user." });
        }

        // Remove from current user's following list
        currentUser.following.pull(userIdToUnfollow);
        await currentUser.save();

        // Remove from target user's followers list
        userToUnfollow.followers.pull(currentUserId);
        await userToUnfollow.save();

        res.status(200).json({ message: "Successfully unfollowed user." });

    } catch (err) {
        console.error("Error unfollowing user:", err);
        res.status(500).json({ error: "Failed to unfollow user. " + err.message });
    }
};

// Get users someone is following
exports.getFollowing = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId)
            .populate('following', 'username avatar bio'); // Populate with desired fields
        
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.status(200).json(user.following);
    } catch (err) {
        console.error("Error fetching following list:", err);
        res.status(500).json({ error: "Failed to fetch following list. " + err.message });
    }
};

// Get a user's followers
exports.getFollowers = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId)
            .populate('followers', 'username avatar bio'); // Populate with desired fields

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.status(200).json(user.followers);
    } catch (err) {
        console.error("Error fetching followers list:", err);
        res.status(500).json({ error: "Failed to fetch followers list. " + err.message });
    }
};