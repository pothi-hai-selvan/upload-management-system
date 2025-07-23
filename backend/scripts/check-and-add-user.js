const { sequelize } = require('../config/database');
const User = require('../models/User');

const checkAndAddUser = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connected to database successfully.');

    // Check existing users
    const existingUsers = await User.findAll();
    console.log(`Found ${existingUsers.length} existing user(s):`);
    existingUsers.forEach(user => {
      console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });

    // Check if user@gmail.com already exists
    const existingUser = await User.findOne({
      where: {
        email: 'user@gmail.com'
      }
    });

    if (existingUser) {
      console.log('\nUser with email user@gmail.com already exists. Updating password...');
      existingUser.password = '123';
      await existingUser.save();
      console.log('Password updated successfully!');
    } else {
      console.log('\nCreating new user with email user@gmail.com...');
      const newUser = await User.create({
        name: 'User',
        email: 'user@gmail.com',
        password: '123',
        role: 'user'
      });
      console.log('User created successfully!');
      console.log(`ID: ${newUser.id}, Name: ${newUser.name}, Email: ${newUser.email}, Role: ${newUser.role}`);
    }
    
    // Close database connection
    await sequelize.close();
    console.log('Database connection closed.');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Run the script
checkAndAddUser(); 