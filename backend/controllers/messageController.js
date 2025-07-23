const { Message, User } = require('../models');

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { receiver_id, subject, content, priority = 'medium', message_type = 'user_to_admin' } = req.body;
    const sender_id = req.user.id;

    // Validate receiver exists
    const receiver = await User.findByPk(receiver_id);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    // Create message
    const message = await Message.create({
      sender_id,
      receiver_id,
      subject,
      content,
      priority,
      message_type
    });

    // Get message with sender and receiver details
    const messageWithDetails = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'email', 'role']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'name', 'email', 'role']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message: messageWithDetails }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

// Get user's inbox (received messages)
const getInbox = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, unread_only = false } = req.query;

    const whereClause = { receiver_id: userId };
    if (unread_only === 'true') {
      whereClause.is_read = false;
    }

    const messages = await Message.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'email', 'role']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      success: true,
      data: {
        messages: messages.rows,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(messages.count / parseInt(limit)),
          total_messages: messages.count,
          has_next: parseInt(page) * parseInt(limit) < messages.count,
          has_prev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get inbox error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get inbox',
      error: error.message
    });
  }
};

// Get user's sent messages
const getSentMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const messages = await Message.findAndCountAll({
      where: { sender_id: userId },
      include: [
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'name', 'email', 'role']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      success: true,
      data: {
        messages: messages.rows,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(messages.count / parseInt(limit)),
          total_messages: messages.count,
          has_next: parseInt(page) * parseInt(limit) < messages.count,
          has_prev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get sent messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get sent messages',
      error: error.message
    });
  }
};

// Get a specific message
const getMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findOne({
      where: {
        id: messageId,
        [req.user.role === 'admin' ? 'id' : 'receiver_id']: userId
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'email', 'role']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'name', 'email', 'role']
        }
      ]
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Mark as read if receiver is viewing
    if (message.receiver_id === userId && !message.is_read) {
      message.is_read = true;
      message.read_at = new Date();
      await message.save();
    }

    res.json({
      success: true,
      data: { message }
    });
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get message',
      error: error.message
    });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findOne({
      where: {
        id: messageId,
        receiver_id: userId
      }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.is_read = true;
    message.read_at = new Date();
    await message.save();

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark message as read',
      error: error.message
    });
  }
};

// Delete a message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findOne({
      where: {
        id: messageId,
        [req.user.role === 'admin' ? 'id' : 'sender_id']: userId
      }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.destroy();

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
      error: error.message
    });
  }
};

// Admin: Get all messages (for admin dashboard)
const getAllMessages = async (req, res) => {
  try {
    const { page = 1, limit = 50, unread_only = false, priority } = req.query;

    const whereClause = {};
    if (unread_only === 'true') {
      whereClause.is_read = false;
    }
    if (priority) {
      whereClause.priority = priority;
    }

    const messages = await Message.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'email', 'role']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'name', 'email', 'role']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      success: true,
      data: {
        messages: messages.rows,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(messages.count / parseInt(limit)),
          total_messages: messages.count,
          has_next: parseInt(page) * parseInt(limit) < messages.count,
          has_prev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get messages',
      error: error.message
    });
  }
};

// Admin: Send broadcast message to all users
const sendBroadcast = async (req, res) => {
  try {
    const { subject, content, priority = 'medium' } = req.body;
    const adminId = req.user.id;

    // Get all users except admin
    const users = await User.findAll({
      where: { role: 'user' },
      attributes: ['id']
    });

    // Create broadcast messages for each user
    const broadcastMessages = users.map(user => ({
      sender_id: adminId,
      receiver_id: user.id,
      subject,
      content,
      priority,
      message_type: 'admin_broadcast'
    }));

    await Message.bulkCreate(broadcastMessages);

    res.status(201).json({
      success: true,
      message: `Broadcast message sent to ${users.length} users`,
      data: { recipients_count: users.length }
    });
  } catch (error) {
    console.error('Send broadcast error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send broadcast',
      error: error.message
    });
  }
};

module.exports = {
  sendMessage,
  getInbox,
  getSentMessages,
  getMessage,
  markAsRead,
  deleteMessage,
  getAllMessages,
  sendBroadcast
}; 