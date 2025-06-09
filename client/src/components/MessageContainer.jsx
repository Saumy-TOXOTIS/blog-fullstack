// client/src/components/MessageContainer.jsx
import { useEffect, useState, useRef } from 'react';
import api from '../utils/api';
import Message from './Message';
import MessageInput from './MessageInput';
import { useSocket } from '../context/SocketContext';
import { getImageUrl } from '../utils/imageUrl';

// Helper function to get the current user's ID
function getCurrentUserId() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1])).id;
  } catch (e) {
    return null;
  }
}

function MessageContainer({ selectedConversation }) {
  // Get ALL necessary state from the central context
  const { socket, messages, setMessages, typingState } = useSocket();

  // Local state is ONLY for the loading spinner
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Determine if the other user is typing in THIS conversation
  const isTyping = selectedConversation ? typingState[selectedConversation._id] : false;

  // Get the messages for THIS conversation from the global messages object
  const currentMessages = selectedConversation ? messages[selectedConversation._id] || [] : [];

  const getAvatarSrc = (user) => {
    if (!user || !user.avatar) return getImageUrl("https://res.cloudinary.com/dkkzhqs6z/image/upload/v1749432192/default_profile_avatar_lvdgfa.svg");
    return getImageUrl(user.avatar); // 2. Use the helper
  };
  // This useEffect ONLY fetches historical messages when a new chat is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;

      // Only fetch from API if we don't already have the history in our global state
      if (!messages[selectedConversation._id]) {
        setLoading(true);
        try {
          const res = await api.get(`/chat/conversations/${selectedConversation._id}/messages`);
          // Add the fetched history to our global state
          setMessages(prevGlobalState => ({
            ...prevGlobalState,
            [selectedConversation._id]: res.data
          }));
        } catch (error) {
          console.error("Failed to fetch messages", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMessages();
  }, [selectedConversation, messages, setMessages]);


  // This useEffect ONLY handles joining/leaving socket rooms
  useEffect(() => {
    if (socket && selectedConversation) {
      socket.emit('joinRoom', selectedConversation._id);

      // The return function is a 'cleanup' function.
      // It runs when the user clicks a DIFFERENT conversation.
      return () => {
        socket.emit('leaveRoom', selectedConversation._id);
      };
    }
  }, [socket, selectedConversation]);

  // Function to scroll to the latest message
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };
  // This useEffect ONLY handles auto-scrolling
  useEffect(() => {
    // A small delay gives the DOM time to render the new message before scrolling
    scrollToBottom();
  }, [currentMessages, isTyping]); // Scroll when messages array changes or typing starts/stops


  // ALL `socket.on()` listeners have been REMOVED from this component.
  // They now live permanently and safely in SocketContext.jsx


  // Display a placeholder if no chat is selected
  if (!selectedConversation) {
    return (
      <div className="w-2/3 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-2xl">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  // Get the other user's info for the header
  const selfId = getCurrentUserId();
  const otherUser = selectedConversation.participants.find(p => p._id !== selfId);

  return (
    <div className="w-2/3 flex flex-col h-full">
      {/* Header */}
      {otherUser && (
        <div className="flex items-center gap-4 p-4 border-b border-gray-700/50 bg-gray-900/30">
          <img src={getAvatarSrc(otherUser)} alt={otherUser.username} className="w-10 h-10 rounded-full object-cover" />
          <h3 className="font-bold text-lg text-white">{otherUser.username}</h3>
        </div>
      )}

      {/* Messages */}
      <div ref={messagesEndRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {loading && <div className="text-center text-gray-400">Loading messages...</div>}

        {!loading && currentMessages.map((msg) => (
          <Message key={msg._id} message={msg} />
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2">
              <img src={getAvatarSrc(otherUser)} alt="avatar" className="w-8 h-8 rounded-full" />
              <div className="px-4 py-2.5 rounded-2xl text-white bg-gray-700 rounded-bl-none shadow-md">
                <div className="flex items-center justify-center gap-1">
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <MessageInput selectedConversation={selectedConversation} />
    </div>
  );
}

export default MessageContainer;