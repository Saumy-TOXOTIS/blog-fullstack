// client/src/components/UserListItem.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserListItem = ({ user, onModalClose }) => {
  const navigate = useNavigate();

  const getAvatarSrc = (listUser) => {
    if (!listUser) return `https://ui-avatars.com/api/?name=?&background=71717a&color=fff&size=128`;
    const defaultAvatar = "http://localhost:5000/images/default_profile.jpg";
    if (listUser.avatar && listUser.avatar.startsWith('http')) return listUser.avatar;
    if (listUser.avatar && listUser.avatar.startsWith('/images/')) return `http://localhost:5000${listUser.avatar}`;
    return defaultAvatar;
  };

  const handleNavigate = () => {
    if (onModalClose) onModalClose(); // Close modal before navigating
    navigate(`/users/${user._id}`);
  };

  return (
    <div 
      onClick={handleNavigate}
      className="flex items-center p-3 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors duration-200 group"
    >
      <img 
        src={getAvatarSrc(user)} 
        alt={user.username} 
        className="w-10 h-10 rounded-full object-cover mr-4 border-2 border-gray-600 group-hover:border-purple-500 transition-colors"
      />
      <div className="flex-1">
        <p className="font-semibold text-white group-hover:text-purple-300 transition-colors text-sm">{user.username}</p>
        {user.bio && <p className="text-xs text-gray-400 line-clamp-1">{user.bio}</p>}
      </div>
       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 group-hover:text-purple-400 transition-colors ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
};

export default UserListItem;