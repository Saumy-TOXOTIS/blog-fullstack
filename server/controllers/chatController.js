// server/controllers/chatController.js
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// Get all conversations for the logged-in user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.userId;
    const conversations = await Conversation.find({ participants: userId, hiddenBy: { $ne: userId } })
      .populate({
        path: 'participants',
        select: 'username avatar', // Populate participants with username and avatar
      })
      .populate({
        path: 'lastMessage',
        select: 'content sender createdAt', // Populate last message with its content
        populate: {
            path: 'sender',
            select: 'username' // And the sender of the last message
        }
      })
      .sort({ updatedAt: -1 }); // Sort by most recently active

    // We need to filter out the current user from the participants list
    // so the frontend knows who the "other" person is.
    const processedConversations = conversations.map(conv => {
        const convObject = conv.toObject();
        convObject.participants = convObject.participants.filter(p => p._id.toString() !== userId);
        return convObject;
    });

    res.json(processedConversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations.' });
  }
};

// Get all messages for a specific conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId })
      .populate('sender', 'username avatar')
      .sort({ createdAt: 'asc' });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
};

// Creates a new conversation or finds an existing one
exports.createOrGetConversation = async (req, res) => {
  try {
    const senderId = req.userId;
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ error: "Receiver ID is required." });
    }

    // Check if a conversation between these two participants already exists
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    })
      .populate("participants", "-password") // Populate participants' details
      .populate({ // Populate the last message...
          path: 'lastMessage',
          populate: { path: 'sender', select: 'username' } //...and its sender
      });

    // If a conversation is found, return it
    if (conversation) {
      return res.status(200).json(conversation);
    }

    // If no conversation exists, create a new one
    const newConversation = new Conversation({
      participants: [senderId, receiverId],
    });

    await newConversation.save();

    // After saving, populate the fields to match the structure of a found conversation
    const populatedConversation = await Conversation.findById(newConversation._id)
        .populate("participants", "-password");

    res.status(201).json(populatedConversation);

  } catch (error) {
    console.error("Error in createOrGetConversation:", error);
    res.status(500).json({ error: 'Failed to create or get conversation.' });
  }
};

exports.hideConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.userId;

    await Conversation.findByIdAndUpdate(conversationId, {
      $addToSet: { hiddenBy: userId }, // Use $addToSet to prevent duplicate entries
    });

    res.status(200).json({ message: 'Conversation hidden successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to hide conversation.' });
  }
};

// Unhide a conversation for the logged-in user
exports.unhideConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.userId;

    await Conversation.findByIdAndUpdate(conversationId, {
      $pull: { hiddenBy: userId }, // Use $pull to remove the user's ID
    });

    res.status(200).json({ message: 'Conversation unhidden successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unhide conversation.' });
  }
};

// Get all conversations that are hidden by the logged-in user
exports.getHiddenConversations = async (req, res) => {
  try {
    const userId = req.userId;
    // Find conversations where the user's ID IS in the hiddenBy array
    const conversations = await Conversation.find({ participants: userId, hiddenBy: userId })
      .populate({ path: 'participants', select: 'username avatar' })
      .populate({ path: 'lastMessage', select: 'content', populate: { path: 'sender', select: 'username' }})
      .sort({ updatedAt: -1 });

    const processedConversations = conversations.map(conv => {
        const convObject = conv.toObject();
        convObject.participants = convObject.participants.filter(p => p._id.toString() !== userId);
        return convObject;
    });

    res.json(processedConversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hidden conversations.' });
  }
};
// --- We will add controllers for edit, delete, and hide here later ---