// client/src/components/Message.jsx
import { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { getImageUrl } from '../utils/imageUrl';

const EDIT_DELETE_WINDOW_MS = 15 * 60 * 1000;

// Helper function to decode JWT from localStorage to get the current user's ID
function getCurrentUserId() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1])).id;
  } catch (e) {
    return null;
  }
}

function Message({ message }) {
  const currentUserId = getCurrentUserId();
  const { socket } = useSocket(); // Get the socket
  const [showOptions, setShowOptions] = useState(false); // State to show/hide options
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  // Early exit if message or sender is not available
  if (!message || !message.sender) {
    return null;
  }
  const isFromMe = message.sender._id === currentUserId;

  // Check if the message is within the editable/deletable time window
  const isWithinTimeWindow = Date.now() - new Date(message.createdAt).getTime() < EDIT_DELETE_WINDOW_MS;
  
  const chatAlignment = isFromMe ? 'justify-end' : 'justify-start';
  const bubbleColor = isFromMe ? 'bg-gradient-to-br from-purple-600 to-blue-600' : 'bg-gray-700';
  const bubblePosition = isFromMe ? 'rounded-br-none' : 'rounded-bl-none';

  const handleDelete = () => {
    if (socket && window.confirm("Are you sure you want to delete this message?")) {
      socket.emit('deleteMessage', { messageId: message._id });
    }
  };
  const getAvatarSrc = (user) => {
    if (!user || !user.avatar) return getImageUrl('/images/default_profile.jpg');
    return getImageUrl(user.avatar); // 2. Use the helper
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (socket && editedContent.trim() !== message.content) {
      socket.emit('editMessage', { messageId: message._id, newContent: editedContent });
    }
    setIsEditing(false); // Close the edit form
  };

  return (
    <div className={`flex ${chatAlignment} w-full group`}>
      <div 
        className="flex items-end gap-2 max-w-lg"
        onMouseEnter={() => setShowOptions(true)}
        onMouseLeave={() => setShowOptions(false)}
      >
        {!isFromMe && (
          <img src={getAvatarSrc(message.sender)} alt="avatar" className="w-8 h-8 rounded-full self-start" />
        )}

        {/* Message Options (Edit and Delete Buttons) */}
        {isFromMe && !message.isDeleted && showOptions && !isEditing && isWithinTimeWindow && (
          <div className="flex items-center self-center transition-opacity duration-300">
            {/* EDIT BUTTON */}
            <button onClick={() => setIsEditing(true)} className="p-1.5 rounded-full hover:bg-gray-700 text-gray-400 hover:text-cyan-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536l12.232-12.232z" /></svg>
            </button>
            {/* DELETE BUTTON */}
            <button onClick={handleDelete} className="p-1.5 rounded-full hover:bg-red-900/50 text-gray-400 hover:text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        )}

        <div className={`px-4 py-2.5 rounded-2xl text-white ${bubbleColor} ${bubblePosition} shadow-md w-full`}>
          {isEditing ? (
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full bg-transparent border-b-2 border-blue-300/50 focus:border-blue-300 outline-none pb-1 text-base"
                autoFocus
              />
              <div className="text-xs mt-2">
                Press Enter to save, Esc to cancel.
                <button type="submit" className="font-bold ml-2 text-blue-300">Save</button>
                <button type="button" onClick={() => setIsEditing(false)} className="ml-2 text-gray-400">Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <p className={`text-base ${message.isDeleted ? 'italic text-gray-300/80' : ''}`}>{message.content}</p>
              <div className="flex justify-end items-center gap-2">
                {message.isEdited && !message.isDeleted && <span className="text-xs text-gray-400/80">Edited</span>}
                <p className={`text-xs mt-1 text-right ${isFromMe ? 'text-blue-200/80' : 'text-gray-400/80'}`}>
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;