// client/src/components/Profile.jsx
import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import FollowListModal from './FollowListModal';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalListType, setModalListType] = useState('');

  const openFollowModal = (type) => {
    setModalListType(type);
    setModalOpen(true);
  };
  
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/me');
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      // Prepare user data, don't send follower/following arrays for update
      const { followers, following, followerCount, followingCount, ...userDataToUpdate } = user;
      await api.put('/users/me', userDataToUpdate);
      setEditing(false);
      fetchProfile(); 
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const deleteUserAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await api.delete('/users/me');
        localStorage.removeItem('token');
        navigate('/login');
      } catch (err) {
        alert('Failed to delete account');
      }
    }
  };

  const getAvatarSrc = (currentUser) => {
    if (!currentUser) return "http://localhost:5000/images/default_profile.jpg";
    const defaultAvatar = "http://localhost:5000/images/default_profile.jpg";
    if (currentUser.avatar && currentUser.avatar.startsWith('http')) return currentUser.avatar;
    if (currentUser.avatar && currentUser.avatar.startsWith('/images/')) return `http://localhost:5000${currentUser.avatar}`;
    return defaultAvatar;
  };

  if (loading) {
    return (
      <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/80 border border-gray-700 rounded-2xl shadow-xl p-6 md:p-8 overflow-hidden backdrop-blur-sm min-h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-purple-400">Loading Profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
         <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/80 border border-gray-700 rounded-2xl shadow-xl p-6 md:p-8 overflow-hidden backdrop-blur-sm min-h-[300px] flex items-center justify-center">
            <p className="text-red-400">Could not load profile. You might need to log in again.</p>
         </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/80 border border-gray-700/50 rounded-2xl shadow-xl p-6 md:p-8 overflow-hidden backdrop-blur-sm">
      <div className="absolute inset-0 -z-10"> <div className="absolute -top-[100px] -left-[100px] w-[300px] h-[300px] bg-gradient-to-r from-purple-600/10 to-cyan-500/10 rounded-full blur-[100px] animate-pulse-slow"></div> <div className="absolute -bottom-[100px] -right-[100px] w-[300px] h-[300px] bg-gradient-to-r from-blue-600/10 to-purple-500/10 rounded-full blur-[100px] animate-pulse-slow"></div> </div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-l from-purple-500/15 to-transparent rounded-bl-full opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-r from-blue-500/15 to-transparent rounded-tr-full opacity-70"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 p-1 shadow-2xl group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/20 transition-all duration-500"></div>
              <img  src={getAvatarSrc(user)} className="w-full h-full rounded-full object-cover border-2 border-gray-900 group-hover:border-purple-500/50 transition-all duration-500" alt="Avatar" />
            </div>
          </div>
          
          <div className="flex-1 w-full text-center md:text-left">
            {!editing ? (
              <div>
                <div className="mb-2">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-700/30 rounded-full text-xs mb-4 shadow-lg backdrop-blur-sm"> <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> </svg> <span className="text-purple-200 font-medium tracking-wider">YOUR PROFILE</span> </div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg"> {user.username} </h1>
                </div>
                
                <div className="mt-4 p-4 md:p-5 bg-gradient-to-br from-gray-800/40 to-gray-900/60 border border-gray-700/40 rounded-2xl backdrop-blur-sm">
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed italic"> {user.bio || 'No bio yet. Click "Edit Profile" to add one!'} </p>
                </div>
                
                {/* Follower/Following Counts for own profile */}
                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                    <div 
                        className="flex flex-col items-center p-3 bg-gray-900/60 rounded-xl backdrop-blur-sm border border-gray-700/50 min-w-[100px] cursor-pointer hover:border-purple-500/70 transition-colors"
                        onClick={() => openFollowModal('followers')}
                        title="View Your Followers"
                    >
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            {user.followerCount !== undefined ? user.followerCount : '0'}
                        </span>
                        <span className="text-gray-400 mt-1 tracking-wider text-xs">FOLLOWERS</span>
                    </div>
                    <div 
                        className="flex flex-col items-center p-3 bg-gray-900/60 rounded-xl backdrop-blur-sm border border-gray-700/50 min-w-[100px] cursor-pointer hover:border-purple-500/70 transition-colors"
                        onClick={() => openFollowModal('following')}
                        title="View Who You Follow"
                    >
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            {user.followingCount !== undefined ? user.followingCount : '0'}
                        </span>
                        <span className="text-gray-400 mt-1 tracking-wider text-xs">FOLLOWING</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 md:gap-4 mt-8 justify-center md:justify-start">
                  <button onClick={() => setEditing(true)} className="group relative flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-gray-800/60 to-gray-900/70 border border-gray-700/60 rounded-xl hover:border-purple-500/70 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-900/30" > <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div> <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /> </svg> <span className="font-medium text-xs text-gray-200 group-hover:text-white">Edit Profile</span> </button>
                  <button onClick={deleteUserAccount} className="group relative flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-gray-800/60 to-gray-900/70 border border-gray-700/60 rounded-xl hover:border-red-500/70 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-red-900/30" > <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-red-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div> <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /> </svg> <span className="font-medium text-xs text-gray-200 group-hover:text-white">Delete Account</span> </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div className="relative"> <label htmlFor="avatar" className="block text-xs font-medium text-gray-300 mb-1.5"> Avatar URL </label> <div className="relative"> <input type="text" id="avatar" name="avatar" value={user.avatar || ''} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-800/60 border border-gray-700/60 rounded-xl text-white placeholder-gray-400/70 focus:border-purple-500/70 focus:outline-none focus:ring-1 focus:ring-purple-900/40 transition-all backdrop-blur-sm text-sm" placeholder="Paste image URL" /> <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400/70"> <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /> </svg> </div> </div> </div>
                  <div> <label htmlFor="username" className="block text-xs font-medium text-gray-300 mb-1.5"> Username </label> <div className="relative"> <input type="text" name="username" value={user.username || ''} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-800/60 border border-gray-700/60 rounded-xl text-white placeholder-gray-400/70 focus:border-purple-500/70 focus:outline-none focus:ring-1 focus:ring-purple-900/40 transition-all backdrop-blur-sm text-sm" placeholder="Enter username" /> <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400/70"> <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> </svg> </div> </div> </div>
                </div>
                <div> <label htmlFor="bio" className="block text-xs font-medium text-gray-300 mb-1.5"> Bio </label> <div className="relative"> <textarea name="bio" value={user.bio || ''} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-800/60 border border-gray-700/60 rounded-xl text-white placeholder-gray-400/70 focus:border-purple-500/70 focus:outline-none focus:ring-1 focus:ring-purple-900/40 transition-all backdrop-blur-sm text-sm" placeholder="Tell us about yourself..." rows="3" /> <div className="absolute right-3 top-3 text-gray-400/70"> <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /> </svg> </div> </div> </div>
                <div className="flex gap-3 md:gap-4 pt-1 md:pt-2"> <button type="submit" className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-medium text-sm hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-purple-900/30 backdrop-blur-sm" > <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div> <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /> </svg> <span className="relative">Save Changes</span> </button> <button onClick={() => setEditing(false)} className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-800/60 to-gray-900/70 border border-gray-700/60 rounded-xl hover:border-red-500/70 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-red-900/20" > <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-red-800/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div> <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> </svg> <span className="text-gray-200 group-hover:text-white text-sm">Cancel</span> </button> </div>
              </form>
            )}
          </div>
        </div>
        
        {/* Placeholder for more stats or activity - Keep your existing stats if you have them */}
        {!editing && user.posts && ( // Assuming user.posts is fetched, otherwise remove this or adapt
          <div className="mt-8 md:mt-10 pt-5 md:pt-6 border-t border-gray-700/40">
            <h3 className="text-lg font-semibold text-gray-300 mb-4 text-center md:text-left">Activity Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="p-3 bg-gradient-to-br from-gray-800/40 to-gray-900/60 border border-gray-700/40 rounded-xl backdrop-blur-sm text-center"> <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{user.posts?.length || 0}</div> <div className="text-gray-400 text-xs mt-1">Posts Created</div> </div>
              {/* Add more stats like total comments made, likes received etc. if you track them */}
            </div>
          </div>
        )}
      </div>
      {modalOpen && user && (
        <FollowListModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          userId={user._id} // Use logged-in user's ID
          listType={modalListType}
        />
      )}
      <style jsx>{` @keyframes pulse-slow { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.2; } } .animate-pulse-slow { animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; } `}</style>
    </div>
  );
}