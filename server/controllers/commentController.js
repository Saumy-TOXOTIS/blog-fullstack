const Comment = require('../models/Comment');
const Post = require('../models/Post');
const createNotification = require('../utils/createNotification');

// Create a new comment
exports.createComment = async (req, res) => {
    try {
        const { content, parentId } = req.body;
        const { postId } = req.params;
        const senderId = req.userId;
        // We need it to get the author's ID for notifications.
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }
        const commentData = new Comment({
            content,
            author: req.userId,
            post: postId
        });

        if(parentId) {
            const parentComment = await Comment.findById(parentId);
            if(!parentComment) {
                return res.status(404).json({ error: 'Parent comment not found' });
            }
            if(parentComment.post.toString() !== postId) {
                return res.status(400).json({ error: 'Parent comment does not belong to this post' });
            }
            commentData.parentId = parentId;
            await createNotification(req.io, req.userSocketMap, {
                recipient: parentComment.author,
                sender: senderId,
                type: 'reply',
                post: postId,
            });
        } else {
            await createNotification(req.io, req.userSocketMap, {
                recipient: post.author,
                sender: senderId,
                type: 'comment',
                post: postId,
            });
        }

        const comment = new Comment(commentData);
        await comment.save();
        post.comments.push(comment._id);
        await post.save();
        await comment.populate('author','username avatar');
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all comments for a post
exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({post: req.params.postId})
        .populate('author', 'username avatar')
        .sort({ createdAt: -1 });
        res.status(201).json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteCommentAndChildren = async (commentId) => {
    // Find and delete children first
    const children = await Comment.find({ parentId: commentId });
    for (const child of children) {
        await deleteCommentAndChildren(child._id); // Recursive call
    }
    
    // Delete the comment itself
    const commentToDelete = await Comment.findById(commentId);
    if (commentToDelete) {
        // Remove from Post's comments array before deleting the comment
        await Post.findByIdAndUpdate(commentToDelete.post, { $pull: { comments: commentToDelete._id } });
        await Comment.findByIdAndDelete(commentId);
    }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        if (comment.author.toString() !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized to delete this comment' });
        }

        await deleteCommentAndChildren(req.params.id);

        res.json({ message: 'Comment and its replies deleted successfully' });
    } catch (err) {
        console.error("Error deleting comment:", err);
        res.status(500).json({ error: 'Failed to delete comment. ' + err.message });
    }
};