// client/src/components/UserProfile.jsx
import React, { useEffect, useState, useCallback } from 'react';
import api from '../utils/api';
import { useNavigate, useParams } from 'react-router-dom';
import FollowListModal from './FollowListModal';

// Helper function to get current logged-in user ID
function getCurrentAuthUserId() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.id;
  } catch (e) {
    return null;
  }
}

function UserProfile() {
  const navigate = useNavigate();
  const { userId: profileUserId } = useParams(); // Renamed to avoid conflict
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [isFollowingProfile, setIsFollowingProfile] = useState(false);
  const [followInProgress, setFollowInProgress] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalListType, setModalListType] = useState('');

  const openFollowModal = (type) => {
    setModalListType(type);
    setModalOpen(true);
  };

  const currentAuthUserId = getCurrentAuthUserId(); // Logged-in user's ID

  const handleStartChat = async () => {
    try {
      // Call our new backend endpoint
      const res = await api.post('/chat/conversations', { receiverId: profileUserId });
      const conversation = res.data;

      // Navigate to the chat page, passing the newly created/found
      // conversation object in the navigation state.
      navigate('/chat', { state: { selectedConversation: conversation } });
    } catch (error) {
      console.error("Failed to start chat", error);
      // You could show a user-facing error here (e.g., with a toast notification)
    }
  };

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users/${profileUserId}`);
      setUserData(res.data);
      setIsFollowingProfile(res.data.isFollowing || false); // Set initial follow state
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      navigate('/users'); // Redirect if profile not found or error
    }
  }, [profileUserId, navigate]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleFollowToggle = async () => {
    if (followInProgress || !currentAuthUserId) return; // Prevent action if not logged in or already processing
    setFollowInProgress(true);
    try {
      if (isFollowingProfile) {
        await api.delete(`/follow/${profileUserId}`);
        setIsFollowingProfile(false);
        // Optimistically update follower count if userData.user exists
        if (userData && userData.user) {
          setUserData(prev => ({
            ...prev,
            user: {
              ...prev.user,
              followerCount: Math.max(0, (prev.user.followerCount || 1) - 1) // Decrement
            }
          }));
        }
      } else {
        await api.post(`/follow/${profileUserId}`);
        setIsFollowingProfile(true);
        if (userData && userData.user) {
          setUserData(prev => ({
            ...prev,
            user: {
              ...prev.user,
              followerCount: (prev.user.followerCount || 0) + 1 // Increment
            }
          }));
        }
      }
    } catch (err) {
      console.error('Error toggling follow:', err.response ? err.response.data : err.message);
      // Optionally revert optimistic update on error or show a message
      // For simplicity, we'll just log it here.
    } finally {
      setFollowInProgress(false);
    }
  };

  const toggleExpand = (postId) => {
    setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const getAvatarSrc = (user) => {
    if (!user) return `https://ui-avatars.com/api/?name=?&background=71717a&color=fff&size=128`;
    const defaultAvatar = "http://localhost:5000/images/default_profile.jpg";
    if (user.avatar && user.avatar.startsWith('http')) return user.avatar;
    if (user.avatar && user.avatar.startsWith('/images/')) return `http://localhost:5000${user.avatar}`;
    return defaultAvatar;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-slate-900 to-black">
        <div className="flex flex-col items-center"> <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-transparent border-t-purple-500 border-b-cyan-400 mb-4"></div> <span className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-medium"> Loading profile... </span> </div>
      </div>
    );
  }

  if (!userData || !userData.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        User not found.
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-4 md:p-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6"> <button onClick={() => navigate('/users')} className="flex items-center gap-2 group px-5 py-3 bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-purple-900/90 hover:to-indigo-900/90 rounded-xl shadow-lg border border-gray-700 hover:border-purple-500/60 transition-all duration-300 backdrop-blur-sm hover:shadow-purple-900/30" > <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /> </svg> <span className="bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent font-medium"> Back to Users List </span> </button> </div>

        <div className="relative overflow-hidden bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-xl backdrop-blur-sm">
          <div className="absolute inset-0 -z-10"> <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] animate-spin-slow"> <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,#0f172a_0%,#1e293b_25%,#0f172a_50%,#1e293b_75%,#0f172a_100%)] opacity-20"></div> </div> </div>
          <div className="h-48 bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-blue-900/80 relative overflow-hidden"> <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/30"></div> <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-800/70 to-transparent"></div> </div>

          <div className="p-6 md:p-8 relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-gray-800/80 overflow-hidden shadow-2xl group hover:scale-105 transition-transform duration-300">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-cyan-500/20 rounded-full z-10 group-hover:opacity-0 transition-opacity"></div>
                <div className="absolute inset-0 rounded-full border border-white/10 shadow-inner"></div>
                <div className="absolute inset-0 ring-4 ring-transparent group-hover:ring-purple-500/30 transition-all duration-500 rounded-full"></div>
                <img src={getAvatarSrc(userData.user)} alt={`${userData.user.username}'s avatar`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
              </div>
            </div>

            <div className="mt-20 md:mt-24 text-center">
              <div className="inline-flex items-center justify-center px-4 py-1.5 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-full mb-3 shadow-lg"> <span className="text-xs font-semibold tracking-wider text-purple-200">USER PROFILE</span> </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg"> {userData.user.username} </h1>
              <p className="text-gray-300 mt-3 max-w-xl mx-auto text-lg leading-relaxed italic"> {userData.user.bio || "This user hasn't written a bio yet."} </p>

              {/* Follower/Following Counts & Follow Button */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm">
                <div className="flex gap-6">
                  <div
                    className="flex flex-col items-center p-3 bg-gray-900/50 rounded-xl backdrop-blur-sm border border-gray-700/50 min-w-[90px] text-center cursor-pointer hover:border-purple-500/70 transition-colors"
                    onClick={() => openFollowModal('followers')}
                    title="View Followers"
                  >
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      {userData.user.followerCount !== undefined ? userData.user.followerCount : '...'}
                    </span>
                    <span className="text-gray-400 mt-1 tracking-wider text-xs">FOLLOWERS</span>
                  </div>
                  <div
                    className="flex flex-col items-center p-3 bg-gray-900/50 rounded-xl backdrop-blur-sm border border-gray-700/50 min-w-[90px] text-center cursor-pointer hover:border-purple-500/70 transition-colors"
                    onClick={() => openFollowModal('following')}
                    title="View Following"
                  >
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      {userData.user.followingCount !== undefined ? userData.user.followingCount : '...'}
                    </span>
                    <span className="text-gray-400 mt-1 tracking-wider text-xs">FOLLOWING</span>
                  </div>
                </div>

                {/* Follow/Unfollow Button - Show if not viewing own profile and logged in */}
                {currentAuthUserId && currentAuthUserId !== profileUserId && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleFollowToggle}
                    disabled={followInProgress}
                    className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg
                            ${isFollowingProfile
                        ? 'bg-gradient-to-r from-gray-800/60 to-gray-900/70 border border-gray-700/60 rounded-xl hover:border-red-500/70 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-red-900/30'
                        : 'bg-gradient-to-r from-gray-800/60 to-gray-900/70 border border-gray-700/60 rounded-xl hover:border-purple-500/70 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-900/30'
                      } 
                            ${followInProgress ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <div className={`absolute inset-0 ${isFollowingProfile ? 'bg-gradient-to-r from-red-900/20 to-red-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl' : 'bg-gradient-to-r from-purple-900/20 to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl'}`}>
                    </div>
                    <span className="font-medium text-xs text-gray-200 group-hover:text-white">
                      {followInProgress
                        ? (isFollowingProfile ? 'Unfollowing...' : 'Following...')
                        : (isFollowingProfile ? 'Unfollow' : 'Follow')
                      }
                    </span>
                  </button>
                  <button
                    onClick={handleStartChat}
                    className="px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg bg-gradient-to-r from-gray-800/60 to-gray-900/70 border border-gray-700/60 rounded-xl hover:border-cyan-500/70 backdrop-blur-sm hover:shadow-cyan-900/30"
                  >
                    <span className="font-medium text-xs text-gray-200 group-hover:text-white">
                      Message
                    </span>
                  </button>
                </div>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-500">Joined: {new Date(userData.user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
            </div>

            <div className="mt-10 md:mt-14">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-700/70"> <h2 className="text-2xl font-bold"> Posts by <span className="text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text drop-shadow-md">{userData.user.username}</span> </h2> <div className="text-sm text-gray-400 px-3 py-1 bg-gray-900/50 rounded-lg border border-gray-700/50 backdrop-blur-sm"> {userData.posts.length} {userData.posts.length === 1 ? 'post' : 'posts'} </div> </div>

              {userData.posts.length === 0 ? (
                <div className="text-center py-12"> <div className="inline-block p-5 bg-gray-900/50 rounded-full mb-4 border border-gray-700/50 backdrop-blur-sm"> <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> </svg> </div> <p className="text-lg text-gray-300">No posts yet</p> <p className="text-gray-500 mt-2 max-w-md mx-auto"> When {userData.user.username} creates posts, they'll appear here. </p> </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {userData.posts.map(post => (
                    <div key={post._id} className="group bg-gradient-to-b from-gray-800/40 to-gray-900/60 border border-gray-700/50 hover:border-purple-500/50 rounded-xl shadow-lg p-5 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/15 relative overflow-hidden backdrop-blur-sm transform hover:-translate-y-1" > <div className="absolute inset-0 -z-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"> <div className="absolute -inset-[2px] bg-gradient-to-r from-purple-500/10 to-cyan-400/10 rounded-xl blur-sm"></div> </div> <div className="absolute top-4 right-4"> <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-sm flex items-center justify-center border border-gray-600/30"> <span className="text-xs font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"> {post.content.length > 300 ? '📖' : '✍️'} </span> </div> </div> <h3 className="text-lg font-bold mb-3 pr-6 group-hover:text-purple-300 transition-colors bg-gradient-to-r from-purple-100/90 to-cyan-100/90 bg-clip-text text-transparent"> {post.title} </h3> {post.imageUrl && (<div className="mb-4 rounded-xl overflow-hidden border border-gray-700/50 group-hover:border-purple-500/30 transition-colors"> <img src={`${post.imageUrl.startsWith('/') ? 'http://localhost:5000' : ''}${post.imageUrl}`} alt={post.title} className="w-full h-48 object-cover group-hover:scale-[1.02] transition-transform duration-300" /> </div>)} <div className="relative min-h-[70px] mb-3"> {expandedPosts[post._id] ? (<p className="text-gray-300 leading-relaxed text-sm">{post.content}</p>) : (<> <p className="text-gray-300 line-clamp-3 leading-relaxed text-sm"> {post.content.substring(0, 120)} {post.content.length > 120 ? '...' : ''} </p> <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900/70 to-transparent rounded-b-xl"></div> </>)} </div> <button onClick={() => toggleExpand(post._id)} className="w-full py-2 text-xs font-medium rounded-lg bg-gradient-to-r from-gray-700/60 to-gray-800/60 border border-gray-700/60 hover:from-purple-800/80 hover:to-indigo-800/80 hover:border-purple-500/70 transition-all duration-300 group-hover:shadow-md group-hover:shadow-purple-900/20" > {expandedPosts[post._id] ? (<span className="flex items-center justify-center gap-2 text-gray-300 group-hover:text-white"> <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /> </svg> Show less </span>) : (<span className="flex items-center justify-center gap-2 text-gray-300 group-hover:text-white"> <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /> </svg> Read more </span>)} </button> </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div> {/* This closes the main content wrapper for the profile card */}
      {modalOpen && (
        <FollowListModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          userId={profileUserId}
          listType={modalListType}
        />
      )}
    </div>
  );
}

export default UserProfile;