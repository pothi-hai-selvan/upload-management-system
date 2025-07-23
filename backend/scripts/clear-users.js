const { sequelize } = require('../config/database');
const User = require('../models/User');

const clearUsers = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connected to database successfully.');

    // Clear all users
    const deletedCount = await User.destroy({
      where: {},
      truncate: false
    });

    console.log(`Successfully deleted ${deletedCount} user(s) from the database.`);
    
    // Close database connection
    await sequelize.close();
    console.log('Database connection closed.');
    
  } catch (error) {
    console.error('Error clearing users:', error);
    process.exit(1);
  }
};

// Run the script
clearUsers(); 