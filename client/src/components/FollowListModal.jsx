// client/src/components/FollowListModal.jsx
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import UserListItem from './UserListItem';

const FollowListModal = ({ isOpen, onClose, userId, listType }) => { // listType: 'followers' or 'following'
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !userId || !listType) {
        setUsers([]); // Reset users when not open or params missing
        return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const endpoint = listType === 'followers' ? `/follow/${userId}/followers` : `/follow/${userId}/following`;
        const res = await api.get(endpoint);
        setUsers(res.data);
      } catch (err) {
        console.error(`Error fetching ${listType}:`, err);
        setError(`Failed to load ${listType}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen, userId, listType]);

  if (!isOpen) {
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999] p-4"
        onClick={onClose} // Close on overlay click
    >
      <div 
        className="bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 border border-gray-700/70 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-700/50">
          <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            {listType.charAt(0).toUpperCase() + listType.slice(1)}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-2 overflow-y-auto flex-grow custom-scrollbar-thin">
          {loading && (
            <div className="py-10 text-center text-gray-400">Loading users...</div>
          )}
          {error && (
            <div className="py-10 text-center text-red-400">{error}</div>
          )}
          {!loading && !error && users.length === 0 && (
            <div className="py-10 text-center text-gray-500">No users to display.</div>
          )}
          {!loading && !error && users.length > 0 && (
            <div className="space-y-1 p-2">
              {users.map(user => (
                <UserListItem key={user._id} user={user} onModalClose={onClose} />
              ))}
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar-thin::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar-thin::-webkit-scrollbar-track { background: rgba(31, 41, 55, 0.2); border-radius: 10px; }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(107, 114, 128, 0.3); border-radius: 10px; }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.4); }
      `}</style>
    </div>
  );
};

export default FollowListModal;