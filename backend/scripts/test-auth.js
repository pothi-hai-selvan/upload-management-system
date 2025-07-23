const { sequelize } = require('../config/database');
const User = require('../models/User');

const testAuth = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Connected to database successfully.');

    // Sync models
    await sequelize.sync({ force: false });
    console.log('✅ Database models synchronized.');

    // Check if users exist
    const userCount = await User.count();
    console.log(`📊 Total users in database: ${userCount}`);

    if (userCount === 0) {
      console.log('❌ No users found in database!');
      console.log('Please run: node scripts/init-users.js');
      return;
    }

    // Test admin login
    console.log('\n🔍 Testing admin login...');
    const admin = await User.findOne({ where: { email: 'admin@gmail.com', role: 'admin' } });
    
    if (admin) {
      console.log('✅ Admin user found');
      const isPasswordValid = await admin.comparePassword('admin123');
      console.log(`🔐 Admin password valid: ${isPasswordValid}`);
    } else {
      console.log('❌ Admin user not found');
    }

    // Test user login
    console.log('\n🔍 Testing user login...');
    const user = await User.findOne({ where: { email: 'user@gmail.com', role: 'user' } });
    
    if (user) {
      console.log('✅ User found');
      const isPasswordValid = await user.comparePassword('user123');
      console.log(`🔐 User password valid: ${isPasswordValid}`);
    } else {
      console.log('❌ User not found');
    }

    // Display all users
    const allUsers = await User.findAll({
      attributes: ['id', 'name', 'email', 'role']
    });
    
    console.log('\n📋 All users in database:');
    allUsers.forEach(user => {
      console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });
    
    // Close database connection
    await sequelize.close();
    console.log('\n✅ Database connection closed.');
    
  } catch (error) {
    console.error('❌ Error testing auth:', error);
    process.exit(1);
  }
};

// Run the script
testAuth(); 