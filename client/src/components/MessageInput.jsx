// client/src/components/MessageInput.jsx
import { useState, useRef, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import EmojiPicker from 'emoji-picker-react';

function MessageInput({ selectedConversation }) {
  const [content, setContent] = useState('');
  const { socket } = useSocket();
  const typingTimeoutRef = useRef(null);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  // 3. Add logic to close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [pickerRef]);

  // 4. Function to handle emoji selection
  const onEmojiClick = (emojiObject) => {
    setContent(prevInput => prevInput + emojiObject.emoji);
  };

  const handleInputChange = (e) => {
    setContent(e.target.value);

    if (!socket || !selectedConversation) return;

    // If this is the first keypress, emit 'startTyping'
    if (!typingTimeoutRef.current) {
      socket.emit('startTyping', { conversationId: selectedConversation._id });
    }

    // Clear the previous timeout
    clearTimeout(typingTimeoutRef.current);

    // Set a new timeout. If the user doesn't type for 2 seconds, we'll emit 'stopTyping'.
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { conversationId: selectedConversation._id });
      typingTimeoutRef.current = null; // Reset the ref
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() || !socket || !selectedConversation) return;

    const receiverId = selectedConversation.participants[0]._id;
    clearTimeout(typingTimeoutRef.current);
    socket.emit('stopTyping', { conversationId: selectedConversation._id });
    typingTimeoutRef.current = null;

    // Emit the 'sendMessage' event to the server
    socket.emit('sendMessage', {
      receiverId,
      content,
    });
    
    setContent(''); // Clear the input field
  };

  return (
    <div className="p-4 bg-gradient-to-t from-gray-900 to-gray-900/60 border-t border-gray-700/50 backdrop-blur-sm">
      {showPicker && (
        <div ref={pickerRef} className="absolute bottom-full mb-2">
          <EmojiPicker 
            onEmojiClick={onEmojiClick}
            theme="dark"
            emojiStyle="native"
            height={400}
            width={350}
          />
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <button 
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="p-2 rounded-full hover:bg-purple-500/20 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-sm opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"></div>
          <input
            type="text"
            value={content}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700/60 rounded-xl text-white placeholder-gray-400/70 focus:border-purple-500/60 focus:outline-none focus:ring-2 focus:ring-purple-900/30 transition-all backdrop-blur-lg relative z-10"
          />
        </div>
        <button
          type="submit"
          className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg relative overflow-hidden group ${
            !content.trim() ? 'bg-gray-700/60 text-gray-400' : 
            'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-xl hover:shadow-purple-900/40'
          }`}
          disabled={!content.trim()}
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            Send
          </span>
          <div className={`absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            !content.trim() ? 'hidden' : ''
          }`}></div>
        </button>
      </form>
    </div>
  );
}

export default MessageInput;