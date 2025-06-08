// client/src/components/ConversationList.jsx
import { useEffect, useState, useRef } from 'react';
import api from '../utils/api';
import { useSocket } from '../context/SocketContext';

// Enhanced Conversation Item Component
function Conversation({ conversation, onSelect, isSelected, onAction, isHiddenList }) {
  const { onlineUsers } = useSocket();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const otherUser = conversation.participants[0];
  
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  if (!otherUser) return null;
  const isOnline = onlineUsers.includes(otherUser._id);

  const handleAction = async (action) => {
    setMenuOpen(false); // Close menu on action
    await onAction(action, conversation._id);
  };

  return (
    <div
      onClick={() => onSelect(conversation)}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group relative ${
        isSelected 
          ? 'bg-gradient-to-r from-purple-900/40 to-blue-900/30 border-l-2 border-purple-500' 
          : 'hover:bg-gray-700/50'
      }`}
    >
      {/* Enhanced Avatar with Glow Effect */}
      <div className="relative">
        <div className={`w-12 h-12 rounded-full p-0.5 ${isOnline ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-purple-600 to-blue-500'}`}>
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-900">
            <img 
              src={`http://localhost:5000${otherUser.avatar}`} 
              alt={otherUser.username} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900">
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
          </div>
        )}
      </div>
      
      {/* User Info */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold truncate ${isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
          {otherUser.username}
        </p>
        <p className="text-xs truncate text-gray-400 group-hover:text-gray-200 transition-colors">
          {conversation.lastMessage?.content || 'No messages yet'}
        </p>
      </div>

      {/* Enhanced More Options Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} 
        className="p-1 rounded-full text-gray-400 hover:text-white transition-colors group-hover:bg-gray-700/50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
        </svg>
      </button>

      {/* Enhanced Options Menu Dropdown */}
      {menuOpen && (
        <div 
          ref={menuRef} 
          className="absolute top-10 right-2 w-40 bg-gray-800/90 backdrop-blur-lg border border-gray-700 rounded-lg shadow-xl z-10 py-1 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/90 to-gray-900/90 -z-10"></div>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur-sm -z-20"></div>
          
          <button 
            onClick={() => handleAction(isHiddenList ? 'unhide' : 'hide')} 
            className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-purple-800/50 hover:text-white transition-all duration-300"
          >
            {isHiddenList ? 'Unhide Chat' : 'Hide Chat'}
          </button>
        </div>
      )}
    </div>
  );
}

// Enhanced Main List Component
function ConversationList({ conversations, loading, onSelectConversation, selectedConversation, onAction, isHiddenList, onToggleHidden }) {
  return (
    <div className="w-1/3 border-r border-gray-700/50 flex flex-col bg-gradient-to-b from-gray-900/30 to-gray-900/10">
      {/* Enhanced Header */}
      <div className="p-4 border-b border-gray-700/50 flex justify-between items-center bg-gray-900/20 backdrop-blur-sm">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow">
          {isHiddenList ? 'Hidden Chats' : 'Chats'}
        </h2>
        
        {/* Enhanced Toggle Button */}
        <button 
          onClick={onToggleHidden} 
          title={isHiddenList ? "Show Active Chats" : "Show Hidden Chats"}
          className={`p-2 rounded-full transition-all duration-300 ${
            isHiddenList 
              ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/20 text-amber-400 hover:from-amber-500/30 hover:to-amber-600/30' 
              : 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-400 hover:from-purple-500/30 hover:to-blue-500/30'
          }`}
        >
          {isHiddenList ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-7-8a7 7 0 1114 0 7 7 0 01-14 0zm7-5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        {loading && (
          <div className="flex flex-col items-center justify-center p-6">
            <div className="w-16 h-16 border-t-4 border-purple-500 border-opacity-50 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">Loading conversations...</p>
          </div>
        )}
        
        {!loading && conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 mb-1">
              {isHiddenList ? 'No hidden chats' : 'No conversations started'}
            </p>
            <p className="text-sm text-gray-600">
              {isHiddenList ? 'All your chats are visible' : 'Start a conversation now!'}
            </p>
          </div>
        )}
        
        <div className="space-y-2">
          {!loading && conversations.map((conv) => (
            <Conversation
              key={conv._id}
              conversation={conv}
              onSelect={onSelectConversation}
              isSelected={selectedConversation?._id === conv._id}
              onAction={onAction}
              isHiddenList={isHiddenList}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ConversationList;