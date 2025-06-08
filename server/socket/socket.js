// server/socket/socket.js
const jwt = require('jsonwebtoken');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const createNotification = require('../utils/createNotification');

const EDIT_DELETE_WINDOW_MS = 15 * 60 * 1000;
// This object will map a userId to their currently active socketId
// e.g., { "60d...user_id...f7": "aBcDeFgHiJkL123" }
const userSocketMap = {};

// This is a helper function to avoid repeating the broadcast logic
const broadcastToConversation = async (io, conversationId, event, payload) => {
  const conversation = await Conversation.findById(conversationId);
  if (conversation) {
    conversation.participants.forEach(participantId => {
      const socketId = userSocketMap[participantId.toString()];
      if (socketId) {
        io.to(socketId).emit(event, payload);
      }
    });
  }
};

function socketHandler(io) {
  // This is a Socket.IO middleware. It runs for every incoming connection.
  // Here, we verify the JWT sent by the client.
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) throw new Error("Authentication error.");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Authentication error."));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    console.log(`User connected: ${userId} on socket ${socket.id}`);
    userSocketMap[userId] = socket.id;
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('sendMessage', async ({ receiverId, content }) => {
      try {
        const senderId = socket.userId;

        let conversation = await Conversation.findOneAndUpdate(
          { participants: { $all: [senderId, receiverId] } },
          { $setOnInsert: { participants: [senderId, receiverId] } },
          { upsert: true, new: true }
        );

        const newMessage = new Message({
          conversationId: conversation._id,
          sender: senderId,
          content,
        });

        await newMessage.save();

        // Update the last message and timestamp on the conversation
        conversation.lastMessage = newMessage._id;
        await conversation.save();

        await createNotification(io, userSocketMap, {
          recipient: receiverId,
          sender: senderId,
          type: 'chat',
        });

        const messageToSend = await Message.findById(newMessage._id).populate('sender', 'username avatar');
        const conversationToSend = await Conversation.findById(conversation._id)
          .populate({ path: 'participants', select: 'username avatar' })
          .populate({ path: 'lastMessage', select: 'content' });

        // Broadcast both the new message and the updated conversation
        await broadcastToConversation(io, conversation._id, 'newMessage', messageToSend);
        await broadcastToConversation(io, conversation._id, 'conversationUpdated', conversationToSend);

      } catch (error) {
        console.error("Error in sendMessage:", error);
      }
    });

    socket.on('editMessage', async ({ messageId, newContent }) => {
      try {
        const message = await Message.findOne({ _id: messageId, sender: socket.userId });
        if (!message || Date.now() - message.createdAt.getTime() > EDIT_DELETE_WINDOW_MS) {
          return; // Silently fail if message not found, not owner, or time expired
        }

        message.content = newContent;
        message.isEdited = true;
        await message.save();

        const conversation = await Conversation.findById(message.conversationId)
          .populate({ path: 'participants', select: 'username avatar' })
          .populate({ path: 'lastMessage', select: 'content' });

        const payload = {
          messageId: message._id,
          conversationId: message.conversationId,
          newContent: message.content,
        };

        await broadcastToConversation(io, message.conversationId, 'messageEdited', payload);
        await broadcastToConversation(io, message.conversationId, 'conversationUpdated', conversation);

      } catch (error) {
        console.error("Error editing message:", error);
      }
    });

    socket.on('deleteMessage', async ({ messageId }) => {
      try {
        const message = await Message.findOne({ _id: messageId, sender: socket.userId });
        if (!message || Date.now() - message.createdAt.getTime() > EDIT_DELETE_WINDOW_MS) {
          return; // Silently fail
        }

        message.content = 'This message was deleted.';
        message.isDeleted = true;
        await message.save();

        let conversation = await Conversation.findById(message.conversationId);

        // If the deleted message was the last one, we need to find the new last message
        if (conversation.lastMessage?.equals(message._id)) {
          const newLastMessage = await Message.findOne({ conversationId: conversation._id }).sort({ createdAt: -1 });
          conversation.lastMessage = newLastMessage ? newLastMessage._id : null;
          await conversation.save();
        }

        const conversationToSend = await Conversation.findById(conversation._id)
          .populate({ path: 'participants', select: 'username avatar' })
          .populate({ path: 'lastMessage', select: 'content' });

        const payload = {
          messageId: message._id,
          conversationId: message.conversationId,
        };

        await broadcastToConversation(io, message.conversationId, 'messageDeleted', payload);
        await broadcastToConversation(io, message.conversationId, 'conversationUpdated', conversationToSend);

      } catch (error) {
        console.error("Error deleting message:", error);
      }
    });

    // Typing Listeners

    socket.on('startTyping', ({ conversationId }) => {
      // Broadcast to all other sockets in the conversation EXCEPT the sender
      socket.to(conversationId).emit('typingStarted', { conversationId });
    });

    socket.on('stopTyping', ({ conversationId }) => {
      // Broadcast to all other sockets in the conversation EXCEPT the sender
      socket.to(conversationId).emit('typingStopped', { conversationId });
    });

    socket.on('joinRoom', (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${userId} joined room ${conversationId}`);
    });

    socket.on('leaveRoom', (conversationId) => {
      socket.leave(conversationId);
      console.log(`User ${userId} left room ${conversationId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
      delete userSocketMap[userId];
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
  });
}

module.exports = { socketHandler, userSocketMap };