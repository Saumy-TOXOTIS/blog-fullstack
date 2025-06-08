// client/src/components/ChatPage.jsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ConversationList from './ConversationList';
import MessageContainer from './MessageContainer';
import api from '../utils/api';

function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [hiddenConversations, setHiddenConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showHidden, setShowHidden] = useState(false);
  const location = useLocation();

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/chat/conversations');
      const fetchedConversations = res.data;
      setConversations(fetchedConversations);
      
      const preSelectedConv = location.state?.selectedConversation;
      if (preSelectedConv) {
        const fullConv = fetchedConversations.find(c => c._id === preSelectedConv._id);
        setSelectedConversation(fullConv || preSelectedConv);
      }
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchHiddenConversations = async () => {
    try {
        setLoading(true);
        const res = await api.get('/chat/conversations/hidden');
        setHiddenConversations(res.data);
    } catch (error) {
        console.error("Failed to fetch hidden conversations", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (showHidden) {
      fetchHiddenConversations();
    } else {
      fetchConversations();
    }
  }, [location.state, showHidden]);

  const handleAction = async (action, conversationId) => {
    try {
      if (action === 'hide') {
        await api.post(`/chat/conversations/${conversationId}/hide`);
        setConversations(prev => prev.filter(c => c._id !== conversationId));
      } else if (action === 'unhide') {
        await api.post(`/chat/conversations/${conversationId}/unhide`);
        setHiddenConversations(prev => prev.filter(c => c._id !== conversationId));
      }
      if (selectedConversation?._id === conversationId) {
        setSelectedConversation(null); // Deselect if the current chat is acted upon
      }
    } catch (error) {
      console.error(`Failed to ${action} conversation`, error);
    }
  };
  
  const handleToggleHidden = () => {
    setShowHidden(!showHidden);
    setSelectedConversation(null); // Deselect conversation when switching lists
  };

  return (
    <div className="flex-grow flex h-[calc(100vh-140px)] bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-4 md:p-6 gap-6">
      <div className="flex w-full h-full bg-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl shadow-2xl shadow-purple-900/20 overflow-hidden">
        <ConversationList
          conversations={showHidden ? hiddenConversations : conversations}
          loading={loading}
          onSelectConversation={setSelectedConversation}
          selectedConversation={selectedConversation}
          onAction={handleAction}
          isHiddenList={showHidden}
          onToggleHidden={handleToggleHidden}
        />
        <MessageContainer selectedConversation={selectedConversation} />
      </div>
    </div>
  );
}

export default ChatPage;