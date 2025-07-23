const User = require('./User');
const Document = require('./Document');
const Message = require('./Message');

// Define associations
User.hasMany(Document, {
  foreignKey: 'user_id',
  as: 'documents',
  onDelete: 'CASCADE'
});

Document.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Message associations
User.hasMany(Message, {
  foreignKey: 'sender_id',
  as: 'sentMessages',
  onDelete: 'CASCADE'
});

User.hasMany(Message, {
  foreignKey: 'receiver_id',
  as: 'receivedMessages',
  onDelete: 'CASCADE'
});

Message.belongsTo(User, {
  foreignKey: 'sender_id',
  as: 'sender'
});

Message.belongsTo(User, {
  foreignKey: 'receiver_id',
  as: 'receiver'
});

module.exports = {
  User,
  Document,
  Message
}; 