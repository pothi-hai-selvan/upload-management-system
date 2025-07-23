const { sequelize } = require('../config/database');
const User = require('../models/User');
const Message = require('../models/Message');

const initMessages = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connected to database successfully.');

    // Sync models to create tables
    await sequelize.sync({ force: false });
    console.log('Database models synchronized.');

    // Check if admin user exists
    const admin = await User.findOne({
      where: { email: 'admin@gmail.com' }
    });

    if (!admin) {
      console.log('❌ Admin user not found. Please create admin user first.');
      return;
    }

    console.log('✅ Admin user found:', admin.email);

    // Check if user exists
    const user = await User.findOne({
      where: { email: 'user@gmail.com' }
    });

    if (!user) {
      console.log('❌ User not found. Please create user first.');
      return;
    }

    console.log('✅ User found:', user.email);

    // Create a sample message from user to admin
    const sampleMessage = await Message.create({
      sender_id: user.id,
      receiver_id: admin.id,
      subject: 'Welcome Message',
      content: 'Hello Admin! This is a sample message from the user. I would like to know more about the document upload system.',
      priority: 'medium',
      message_type: 'user_to_admin'
    });

    console.log('✅ Sample message created:');
    console.log(`- ID: ${sampleMessage.id}`);
    console.log(`- Subject: ${sampleMessage.subject}`);
    console.log(`- From: ${user.email} to ${admin.email}`);
    console.log(`- Priority: ${sampleMessage.priority}`);

    // Get message count
    const messageCount = await Message.count();
    console.log(`\n📊 Total messages in database: ${messageCount}`);

    // Close database connection
    await sequelize.close();
    console.log('\nDatabase connection closed.');
    
    console.log('\n🎉 Messaging system initialized successfully!');
    console.log('You can now:');
    console.log('1. Send messages from user to admin');
    console.log('2. Reply to messages from admin to user');
    console.log('3. Send broadcast messages to all users');
    console.log('4. View message history and manage conversations');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Run the script
initMessages(); 