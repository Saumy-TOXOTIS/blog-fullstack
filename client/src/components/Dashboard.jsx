// client/src/components/Dashboard.jsx
import { useEffect, useState, useCallback } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';
import LikeButton from './LikeButton';
import Comment from './Comment'; // Your updated Comment component
import { getImageUrl } from '../utils/imageUrl';

// Helper function to decode JWT
function getCurrentUserId() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.id;
  } catch (e) {
    console.error('Failed to decode token', e);
    return null;
  }
}

function Dashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  // Store all comments for EACH post in a flat list, keyed by postId
  const [allCommentsByPostId, setAllCommentsByPostId] = useState({});
  const [newTopLevelComment, setNewTopLevelComment] = useState({}); // For top-level comments content
  const [showComments, setShowComments] = useState({}); // Toggles visibility of comment sections
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const userId = getCurrentUserId();

  const fetchPosts = useCallback(async () => {
    try {
      const res = await api.get('/posts');
      const enrichedPosts = res.data.map(post => ({
        ...post,
        isLiked: post.isLiked !== undefined ? post.isLiked : (post.likes?.some(like => like.userId === userId) || false),
        likeCount: post.likeCount !== undefined ? post.likeCount : (post.likes?.length || 0),
      }));
      setPosts(enrichedPosts);
      if (loading) setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) navigate('/');
      if (loading) setLoading(false);
      console.error('Error fetching posts:', err);
    }
  }, [userId, navigate, loading]);


  const fetchCommentsForPost = async (postId) => {
    try {
      const res = await api.get(`/comments/${postId}/comments`);
      setAllCommentsByPostId(prev => ({
        ...prev,
        [postId]: res.data // Store the flat list of all comments for this post
      }));
    } catch (err) {
      console.error(`Failed to load comments for post ${postId}`, err);
    }
  };

  // Handles adding ANY new comment (top-level or reply) to the state
  const handleCommentAdded = (newCommentData, postId) => {
    setAllCommentsByPostId(prev => {
      const currentPostComments = prev[postId] || [];
      // Avoid adding duplicates if already present (e.g., from optimistic update elsewhere)
      if (currentPostComments.some(c => c._id === newCommentData._id)) {
        return prev;
      }
      return {
        ...prev,
        [postId]: [...currentPostComments, newCommentData]
      };
    });
  };

  const handleTopLevelCommentSubmit = async (e, postId) => {
    e.preventDefault();
    const content = newTopLevelComment[postId];
    if (!content || !content.trim() || !token) return;

    try {
      const res = await api.post(`/comments/${postId}/comments`, {
        content: content,
        parentId: null // Explicitly null for top-level comments
      });
      handleCommentAdded(res.data, postId); // Use the generic handler
      setNewTopLevelComment(prev => ({ ...prev, [postId]: '' })); // Clear input
    } catch (err) {
      console.error('Failed to add top-level comment', err);
      // Add user-facing error
    }
  };

  // Function to recursively find all descendant IDs of a comment
  const getAllDescendantIds = (allComments, parentId) => {
    let descendants = [];
    const children = allComments.filter(comment => comment.parentId === parentId);
    for (const child of children) {
      descendants.push(child._id);
      descendants = descendants.concat(getAllDescendantIds(allComments, child._id));
    }
    return descendants;
  };

  const handleDeleteComment = async (commentIdToDelete, postId) => {
    if (!window.confirm('Are you sure you want to delete this comment and all its replies?')) return;
    try {
      await api.delete(`/comments/${commentIdToDelete}`);
      // Client-side removal of the comment and all its descendants
      setAllCommentsByPostId(prev => {
        const postComments = prev[postId] || [];
        const descendantIds = getAllDescendantIds(postComments, commentIdToDelete);
        const idsToRemove = new Set([commentIdToDelete, ...descendantIds]);
        return {
          ...prev,
          [postId]: postComments.filter(comment => !idsToRemove.has(comment._id))
        };
      });
    } catch (err) {
      console.error('Failed to delete comment', err);
      // Optionally re-fetch comments on error for consistency
      fetchCommentsForPost(postId);
    }
  };

  const toggleCommentSection = (postId) => {
    if (!allCommentsByPostId[postId] && !showComments[postId]) { // If opening and not loaded
      fetchCommentsForPost(postId);
    }
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const deletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${id}`);
        setPosts(prevPosts => prevPosts.filter(post => post._id !== id));
        // Also remove comments for this post from state
        setAllCommentsByPostId(prev => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });
      } catch (err) {
        alert('Failed to delete post');
        console.error('Error deleting post:', err);
      }
    }
  };

  useEffect(() => {
    fetchPosts();
    const intervalId = setInterval(fetchPosts, 500); // Poll for new posts less frequently
    return () => clearInterval(intervalId);
  }, [fetchPosts]);

  return (
    <div className="flex-grow bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-4 md:p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10"><Profile /></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="relative z-10">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl"></div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
              Community Feed
            </h2>
            <p className="text-gray-400 mt-2 max-w-xl">
              Explore the latest posts from our vibrant community
            </p>
          </div>

          {token && (
            <button
              onClick={() => navigate('/create-post')}
              className="group relative flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-xl hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20"
            >
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current text-purple-400 group-hover:text-white" > <g clipPath="url(#clip0_906_8052)"> <path d="M13.1875 9.28125H10.6875V6.8125C10.6875 6.4375 10.375 6.125 9.96875 6.125C9.59375 6.125 9.28125 6.4375 9.28125 6.84375V9.3125H6.8125C6.4375 9.3125 6.125 9.625 6.125 10.0312C6.125 10.4062 6.4375 10.7187 6.84375 10.7187H9.3125V13.1875C9.3125 13.5625 9.625 13.875 10.0312 13.875C10.4062 13.875 10.7187 13.5625 10.7187 13.1562V10.6875H13.1875C13.5625 10.6875 13.875 10.375 13.875 9.96875C13.875 9.59375 13.5625 9.28125 13.1875 9.28125Z" /> <path d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.8125 19.4688 10.0312 19.4688C15.25 19.4688 19.5 15.2188 19.5 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.5625 18.0625 10C18.0625 14.4375 14.4375 18.0625 10 18.0625Z" /> </g> <defs> <clipPath id="clip0_906_8052)"> <rect width={20} height={20} fill="white" /> </clipPath> </defs> </svg>
              <span className="font-medium">Create New Post</span>
              <div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300 group-hover:left-0 group-hover:w-full"></div>
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20"> <div className="relative"> <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-cyan-500/20 rounded-full blur-xl animate-pulse"></div> <div className="relative animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-transparent border-t-purple-500 border-b-cyan-400"></div> </div> <span className="mt-6 text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-medium"> Loading community posts... </span> </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 md:py-28 bg-gradient-to-br from-gray-800/20 to-gray-900/40 border border-gray-700/30 rounded-3xl backdrop-blur-sm relative overflow-hidden"> <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent"></div> <div className="mb-6 p-5 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30 rounded-full backdrop-blur-sm shadow-lg"> <div className="bg-gray-900 p-4 rounded-full"> <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> </svg> </div> </div> <h3 className="text-2xl font-bold text-gray-200 mb-3">No Posts Found</h3> <p className="text-gray-500 max-w-md text-center mb-6"> Be the first to create a post and start the conversation! </p> <button onClick={() => navigate('/create-post')} className="px-6 py-3 bg-gradient-to-r from-purple-700/50 to-indigo-700/50 border border-purple-500/30 rounded-lg text-purple-300 hover:text-white hover:from-purple-700/70 hover:to-indigo-700/70 transition-all duration-300 backdrop-blur-sm flex items-center gap-2 shadow-md hover:shadow-purple-900/30" > <svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current text-purple-400" > <g clipPath="url(#clip0_906_8052)"> <path d="M13.1875 9.28125H10.6875V6.8125C10.6875 6.4375 10.375 6.125 9.96875 6.125C9.59375 6.125 9.28125 6.4375 9.28125 6.84375V9.3125H6.8125C6.4375 9.3125 6.125 9.625 6.125 10.0312C6.125 10.4062 6.4375 10.7187 6.84375 10.7187H9.3125V13.1875C9.3125 13.5625 9.625 13.875 10.0312 13.875C10.4062 13.875 10.7187 13.5625 10.7187 13.1562V10.6875H13.1875C13.5625 10.6875 13.875 10.375 13.875 9.96875C13.875 9.59375 13.5625 9.28125 13.1875 9.28125Z" /> <path d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.8125 19.4688 10.0312 19.4688C15.25 19.4688 19.5 15.2188 19.5 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.5625 18.0625 10C18.0625 14.4375 14.4375 18.0625 10 18.0625Z" /> </g> <defs> <clipPath id="clip0_906_8052_alt"> <rect width={20} height={20} fill="white" /> </clipPath> </defs> </svg> Create Your First Post </button> </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const currentPostCommentsFlat = allCommentsByPostId[post._id] || [];
              // Filter top-level comments (those without a parentId or with a parentId not in the current list)
              const topLevelCommentsToDisplay = currentPostCommentsFlat
                .filter(comment => !comment.parentId || !currentPostCommentsFlat.find(c => c._id === comment.parentId))
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

              return (
                <div
                  key={post._id}
                  className="group relative bg-gradient-to-b from-gray-800/40 to-gray-900/60 border border-gray-700/40 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:border-purple-500/50 hover:shadow-purple-900/25 transform hover:-translate-y-1"
                >
                  <div className="absolute inset-0 -z-10"> <div className="absolute top-0 left-0 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div> <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl translate-x-1/2 translate-y-1/2"></div> </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/15 to-blue-900/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                  <div className="p-5 relative z-10">
                    {/* Post Header, Image, Content, LikeButton ... (Keep your existing structure) */}
                    <div className="flex items-start gap-4"> <div className="flex-shrink-0"> <div className="relative"> <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div> <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 p-0.5"> <div className="bg-gray-900 rounded-full p-1"> <div className="bg-gray-800 rounded-full w-full h-full flex items-center justify-center"> <span className="text-sm font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent"> {post.author.username.charAt(0).toUpperCase()} </span> </div> </div> </div> </div> </div> <div className="flex-1 min-w-0"> <h3 className="text-lg font-bold group-hover:text-purple-300 transition-colors bg-gradient-to-r from-purple-100/90 to-cyan-100/90 bg-clip-text text-transparent"> {post.title} </h3> <p className="text-sm text-gray-400 mt-1"> By: <span className="text-purple-400">{post.author.username}</span> </p> <p className="text-xs text-gray-500 mt-1"> {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })} </p> </div> </div>
                    <div className="mt-5"> {post.imageUrl && (<div className="mb-4 rounded-xl overflow-hidden border border-gray-700/50 group-hover:border-purple-500/30 transition-colors"> <img src={getImageUrl(post.imageUrl)} alt={post.title} className="w-full h-48 object-cover group-hover:scale-[1.02] transition-transform duration-300" /> </div>)} <div
                      className="text-gray-300 line-clamp-3 prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    /> </div>
                    <div className="mt-5 flex items-center justify-between">
                      <LikeButton postId={post._id} initialIsLiked={post.isLiked} initialLikeCount={post.likeCount} />
                      <button onClick={() => toggleCommentSection(post._id)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-purple-400 group"> <div className="relative"> <div className="absolute -inset-1.5 bg-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /> </svg> </div> <span>{showComments[post._id] ? 'Hide' : 'Show'} Comments ({currentPostCommentsFlat.length === 0 ? 'click to load':currentPostCommentsFlat.length})</span> </button>
                      {token && post.author._id === userId && (<div className="flex gap-2"> <button onClick={() => navigate(`/edit-post/${post._id}`)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/60 border border-gray-700/50 hover:from-purple-700/80 hover:to-indigo-700/80 transition-all duration-300 backdrop-blur-sm group" aria-label="Edit post" title="Edit Post" > <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /> </svg> </button> <button onClick={() => deletePost(post._id)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/60 border border-gray-700/50 hover:from-red-700/80 hover:to-red-700/80 transition-all duration-300 backdrop-blur-sm group" aria-label="Delete Post" title="Delete Post" > <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 6h14M6 6v12a2 2 0 002 2h8a2 2 0 002-2V6M9 5V4a1 1 0 011-1h4a1 1 0 011 1v1" /> </svg> </button> </div>)}
                    </div>

                    {showComments[post._id] && (
                      <div className="mt-6 pt-5 border-t border-gray-700/50">
                        {token && (
                          <form onSubmit={(e) => handleTopLevelCommentSubmit(e, post._id)} className="mb-6 relative">
                            <textarea
                              value={newTopLevelComment[post._id] || ''}
                              onChange={(e) => setNewTopLevelComment(prev => ({ ...prev, [post._id]: e.target.value }))}
                              placeholder="Share your thoughts..."
                              className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700/60 rounded-xl text-white placeholder-gray-400 focus:border-purple-500/70 focus:outline-none focus:ring-2 focus:ring-purple-900/40 backdrop-blur-sm transition-colors"
                              rows="2"
                            ></textarea>
                            <button type="submit" className="absolute bottom-3 right-3 px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-700/60 border border-gray-600/70 rounded-lg text-gray-300 hover:text-purple-300 hover:border-purple-500/50 hover:bg-purple-900/30 transition-all duration-300">
                              Post
                            </button>
                          </form>
                        )}

                        <div className="max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
                          {topLevelCommentsToDisplay.length > 0 ? (
                            topLevelCommentsToDisplay.map((comment) => (
                              <Comment
                                key={comment._id}
                                comment={comment}
                                currentUserId={userId}
                                onDeleteComment={handleDeleteComment} // Pass directly
                                onCommentAdded={(newReplyData) => handleCommentAdded(newReplyData, post._id)}
                                allCommentsForPost={currentPostCommentsFlat} // Pass the full flat list for this post
                                level={0}
                              />
                            ))
                          ) : (
                            <div className="text-center py-4"> <div className="inline-block p-3 bg-gray-800/50 rounded-full mb-2"> <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /> </svg> </div> <p className="text-gray-500 text-sm">No comments yet. {token ? "Be the first to comment!" : "Log in to comment."}</p> </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-l from-purple-500/5 to-transparent rounded-bl-full opacity-70 group-hover:opacity-100"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-r from-cyan-500/5 to-transparent rounded-tr-full opacity-70 group-hover:opacity-100"></div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-gray-800/50 text-center"> <div className="inline-flex items-center gap-8"> <div className="flex flex-col items-center"> <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"> {posts.length} </span> <span className="text-gray-500 text-sm mt-1">Total Posts</span> </div> </div> <p className="text-gray-600 text-xs mt-4"> Content refreshes periodically </p> </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(31, 41, 55, 0.3); border-radius: 10px; } /* gray-800/30 */
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(107, 114, 128, 0.4); border-radius: 10px; } /* gray-500/40 */
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.5); } /* purple-500/50 */
      `}</style>
    </div>
  );
}

export default Dashboard;