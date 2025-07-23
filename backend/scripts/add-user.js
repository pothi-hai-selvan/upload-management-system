const { sequelize } = require('../config/database');
const User = require('../models/User');

const addUser = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connected to database successfully.');

    // Create new user
    const newUser = await User.create({
      name: 'User',
      email: 'user@gmail.com',
      password: '123',
      role: 'user'
    });

    console.log('User created successfully:');
    console.log(`ID: ${newUser.id}`);
    console.log(`Name: ${newUser.name}`);
    console.log(`Email: ${newUser.email}`);
    console.log(`Role: ${newUser.role}`);
    
    // Close database connection
    await sequelize.close();
    console.log('Database connection closed.');
    
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
};

// Run the script
addUser(); 