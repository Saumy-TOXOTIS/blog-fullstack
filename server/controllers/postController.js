// server/controllers/postController.js
const Post = require('../models/Post');
const express = require('express');
const path = require('path');
const FileSystem = require('fs');
const createNotification = require('../utils/createNotification');

exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  try {
    let imageUrl = ""; // Default image URL
    if (req.files && req.files.length > 0) {
      imageUrl = req.files[0].path;
    }
    const post = new Post({
      title,
      content,
      author: req.userId,
      imageUrl
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    if(req.file) {
      FileSystem.unlink(req.file.path);
    }
    res.status(500).json({ error: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username').populate('likes', 'username').sort({ createdAt: -1 });

    const userId = req.userId;
    const enrichedPosts = posts.map(post => ({
      ...post.toObject(),
      isLiked: userId ? post.hasLikedBy(userId) : false,
      likeCount: post.likeCount
    }));
    res.json(enrichedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.userId) return res.status(403).json({ error: 'Unauthorized' });
    await Post.findOneAndDelete({ _id: req.params.id }); // Use findOneAndDelete
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.userId }).populate('author', 'username').populate('likes', 'username');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    const enrichedPost = {
      ...post.toObject(),
      isLiked: req.userId ? post.hasLikedBy(req.userId) : false,
      likeCount: post.likeCount
    };
    
    res.json(enrichedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit Post
exports.updatePost = async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    post.title = title || post.title;
    post.content = content || post.content;

    if (req.files && req.files.length > 0) {
      imageUrl = req.files[0].path;
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const userId = req.userId;
    const isLiked = post.hasLikedBy(userId);
    if (isLiked) {
      // Unlike the post
      post.likes = post.likes.filter(id => !id.equals(userId));
    } else {
      // Like the post
      post.likes.push(userId);
      await createNotification(req.io, req.userSocketMap, {
        recipient: post.author,
        sender: userId,
        type: 'like',
        post: post._id,
      });
    }
    await post.save();
    
    await post.populate('likes', 'username');
    
    const enrichedPost = {
      ...post.toObject(),
      isLiked: !isLiked,
      likeCount: post.likeCount
    };
    
    res.json(enrichedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate('likes', 'username');
      
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    const enrichedPost = {
      ...post.toObject(),
      isLiked: req.userId ? post.hasLikedBy(req.userId) : false,
      likeCount: post.likeCount
    };
    
    res.json(enrichedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.serveImages = express.static(path.join(__dirname, '../uploads'));