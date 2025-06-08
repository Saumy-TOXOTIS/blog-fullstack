// client/src/components/Comment.jsx
import React, { useState } from 'react';
import api from '../utils/api';

// ReplyForm sub-component (can be in its own file if preferred)
function ReplyForm({ postId, parentId, onCommentAdded, onCancel, currentUserId }) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() || !currentUserId) return; // Ensure user is logged in
        setIsSubmitting(true);
        try {
            const res = await api.post(`/comments/${postId}/comments`, {
                content,
                parentId,
            });
            onCommentAdded(res.data);
            setContent('');
            if (onCancel) onCancel();
        } catch (err) {
            console.error('Failed to add reply', err);
            // Consider adding user-facing error message
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-3 ml-8 pl-3 border-l-2 border-gray-700/50">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full px-3 py-2 bg-gray-700/80 border border-gray-600/70 rounded-lg text-white placeholder-gray-400 focus:border-purple-500/70 focus:outline-none focus:ring-1 focus:ring-purple-900/30 text-sm"
                rows="2"
                required
            />
            <div className="mt-2 flex items-center gap-2">
                <button
                    type="submit"
                    disabled={isSubmitting || !currentUserId}
                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-300 disabled:opacity-60"
                >
                    {isSubmitting ? 'Replying...' : 'Post Reply'}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-600 hover:bg-gray-500 text-gray-200 transition-all duration-300"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}


// Main Comment Component
function Comment({ comment, currentUserId, onDeleteComment, onCommentAdded, allCommentsForPost, level = 0 }) {
    const isAuthor = comment.author && comment.author._id === currentUserId;
    const [showReplyForm, setShowReplyForm] = useState(false);

    // Filter direct replies for the current comment from the flat list
    const replies = allCommentsForPost
        .filter(c => c.parentId === comment._id)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const getAvatarSrc = (author) => {
        if (!author) return `https://ui-avatars.com/api/?name=?&background=71717a&color=fff&size=128`; // Default for missing author
        if (author.avatar && author.avatar.startsWith('http')) {
            return author.avatar;
        }
        if (author.avatar) { // Assuming relative path like /images/avatar.jpg
            return `http://localhost:5000${author.avatar}`;
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(author.username || 'User')}&background=random&color=fff&size=128`;
    };

    const avatarSrc = getAvatarSrc(comment.author);
    const authorUsername = comment.author ? comment.author.username : 'Anonymous';

    return (
        <div
            className={`relative group transition-all duration-300 ${level > 0 ? `ml-4 md:ml-6 lg:ml-8 pl-4 border-l-2 border-gray-700/30` : ''} mb-4`}
        >
            <div className="bg-gradient-to-b from-gray-800/[.65] to-gray-900/[.75] border border-gray-700/60 rounded-xl p-3 md:p-4 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-900/15">
                {/* Decorative element can be conditional on level or removed for replies */}
                {level === 0 && <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-l from-purple-500/10 to-transparent rounded-bl-full opacity-70 group-hover:opacity-100"></div>}

                <div className="flex items-start gap-3 md:gap-4 relative z-10">
                    <div className="relative flex-shrink-0">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 shadow-md`}>
                            <div className="bg-gray-900 rounded-full p-0.5 md:p-1 h-full">
                                <img
                                    src={avatarSrc}
                                    alt={authorUsername}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="relative">
                            {/* Speech Bubble Tail (optional for top-level only) */}
                            {level === 0 && (
                                <div className="absolute top-3 -left-2.5 md:-left-3.5 w-3 h-3 bg-gray-800/[.85] rotate-45 border-l border-b border-gray-700/60 transform -translate-x-1/2"></div>
                            )}

                            <div className={`bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 p-3 md:p-4 rounded-xl ${level === 0 ? 'rounded-tl-none' : ''}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-semibold text-sm md:text-base text-white group-hover:text-purple-300 transition-colors">
                                        {authorUsername}
                                    </h4>
                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm md:text-base leading-relaxed break-words">
                                    {comment.content}
                                </p>
                            </div>
                        </div>

                        <div className="mt-2.5 flex items-center gap-3">
                            {currentUserId && ( // Only show reply button if user is logged in
                                <button
                                    onClick={() => setShowReplyForm(!showReplyForm)}
                                    className="flex items-center gap-1 px-2.5 py-1 text-xs bg-gray-700/60 border border-gray-600/70 rounded-lg text-gray-300 hover:text-purple-300 hover:border-purple-500/50 hover:bg-purple-900/30 transition-all duration-300"
                                    aria-expanded={showReplyForm}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                    Reply
                                </button>
                            )}
                            {isAuthor && (
                                <button
                                    onClick={() => onDeleteComment(comment._id, comment.post)}
                                    className="flex items-center gap-1 px-2.5 py-1 text-xs bg-gray-700/60 border border-gray-600/70 rounded-lg text-gray-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-900/20 transition-all duration-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Delete
                                </button>
                            )}
                        </div>

                        {showReplyForm && currentUserId && (
                            <ReplyForm
                                postId={comment.post}
                                parentId={comment._id}
                                onCommentAdded={onCommentAdded} // This function should update allCommentsForPost in Dashboard
                                onCancel={() => setShowReplyForm(false)}
                                currentUserId={currentUserId}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Render Replies Recursively */}
            {replies.length > 0 && (
                <div className="mt-4">
                    {replies.map(reply => (
                        <Comment
                            key={reply._id}
                            comment={reply}
                            currentUserId={currentUserId}
                            onDeleteComment={onDeleteComment}
                            onCommentAdded={onCommentAdded}
                            allCommentsForPost={allCommentsForPost}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Comment;