// client/src/context/SocketContext.jsx
import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import io from 'socket.io-client';
import api from '../utils/api'; // Make sure api utility is imported

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // --- GLOBAL STATE FOR CHAT ---
  // We will manage all chat data here, at the highest level.
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({}); // Stores messages keyed by conversationId
  const [typingState, setTypingState] = useState({}); // Stores typing status keyed by conversationId
  // --- ADD NOTIFICATION STATE ---
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // --- FUNCTION TO FETCH NOTIFICATIONS ---
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
      // Calculate unread count from the fetched data
      const unread = res.data.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  }, []);

  // Function to fetch the initial list of conversations
  const fetchConversations = useCallback(async () => {
    try {
        const res = await api.get('/chat/conversations');
        setConversations(res.data);
    } catch (error) {
        console.error("Failed to fetch conversations", error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Fetch initial data when user is logged in
      fetchNotifications();
      fetchConversations();
      
      const newSocket = io("http://localhost:5000", {
        auth: {
          token: token,
        },
      });

      setSocket(newSocket);

      // --- SETUP ALL REAL-TIME EVENT LISTENERS ---

      // --- LISTENER FOR REAL-TIME NOTIFICATIONS ---
      newSocket.on('newNotification', ({ unreadCount: newCount }) => {
        // The server gives us the new total count
        setUnreadCount(newCount);
        // We then refetch the list to get the new item
        fetchNotifications();
      });
      
      // Handles online user status
      newSocket.on('getOnlineUsers', (users) => {
        setOnlineUsers(users);
      });

      // Handles receiving a new message
      newSocket.on('newMessage', (newMessage) => {
        setMessages((prev) => {
          const convoId = newMessage.conversationId;
          const currentMessages = prev[convoId] || [];
          return { ...prev, [convoId]: [...currentMessages, newMessage] };
        });
      });

      // Handles real-time updates to the conversation list (e.g., new last message)
      newSocket.on('conversationUpdated', (updatedConversation) => {
        setConversations(prevConvos => {
            const exists = prevConvos.some(c => c._id === updatedConversation._id);
            let newConvos;
            if (exists) {
                newConvos = prevConvos.map(c => c._id === updatedConversation._id ? updatedConversation : c);
            } else {
                newConvos = [updatedConversation, ...prevConvos];
            }
            return newConvos.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        });
      });

      // Handles real-time message edits
      newSocket.on('messageEdited', ({ messageId, conversationId, newContent }) => {
        setMessages(prev => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).map(m =>
            m._id === messageId ? { ...m, content: newContent, isEdited: true } : m
          ),
        }));
      });

      // Handles real-time message deletions
      newSocket.on('messageDeleted', ({ messageId, conversationId }) => {
        setMessages(prev => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).map(m =>
            m._id === messageId ? { ...m, content: 'This message was deleted.', isDeleted: true } : m
          ),
        }));
      });

      // Handles the typing indicator
      newSocket.on('typingStarted', ({ conversationId }) => {
        setTypingState(prev => ({ ...prev, [conversationId]: true }));
      });
      newSocket.on('typingStopped', ({ conversationId }) => {
        setTypingState(prev => ({ ...prev, [conversationId]: false }));
      });

      // Cleanup function to close the socket when the component unmounts
      return () => {
        newSocket.close();
        setSocket(null);
      };
    }
  }, [fetchConversations, fetchNotifications]);

  // The value provided to all children components
  const value = {
    socket,
    onlineUsers,
    conversations,
    setConversations, // Needed for hide/unhide logic in ChatPage
    messages,
    setMessages,     // Needed for fetching historical messages
    typingState,
    notifications,
    unreadCount,
    setUnreadCount, // To allow the bell to reset the count
    fetchNotifications, // To allow the bell to refresh the list
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};