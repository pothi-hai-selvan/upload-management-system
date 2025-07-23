const { sequelize } = require('../config/database');
const User = require('../models/User');

const updateUserPassword = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connected to database successfully.');

    // Find the user with email user@gmail.com
    const user = await User.findOne({
      where: {
        email: 'user@gmail.com'
      }
    });

    if (!user) {
      console.log('User with email user@gmail.com not found.');
      return;
    }

    // Update the password
    user.password = '123';
    await user.save();

    console.log('User password updated successfully:');
    console.log(`ID: ${user.id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log('Password has been updated to: 123');
    
    // Close database connection
    await sequelize.close();
    console.log('Database connection closed.');
    
  } catch (error) {
    console.error('Error updating user password:', error);
    process.exit(1);
  }
};

// Run the script
updateUserPassword(); 