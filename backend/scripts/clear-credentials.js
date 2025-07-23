const { sequelize } = require('../config/database');
const User = require('../models/User');

const clearUserCredentials = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connected to database successfully.');

    // Get all users
    const users = await User.findAll();
    console.log(`Found ${users.length} users in the database.`);

    if (users.length === 0) {
      console.log('No users found in the database.');
      return;
    }

    // Clear password for all users
    const updatePromises = users.map(user => {
      return User.update(
        { password: null },
        { where: { id: user.id } }
      );
    });

    await Promise.all(updatePromises);
    console.log(`Successfully cleared passwords for ${users.length} users.`);

    // Verify the changes
    const updatedUsers = await User.findAll();
    const usersWithNullPassword = updatedUsers.filter(user => user.password === null);
    console.log(`Verified: ${usersWithNullPassword.length} users now have null passwords.`);

  } catch (error) {
    console.error('Error clearing user credentials:', error);
  } finally {
    // Close database connection
    await sequelize.close();
    console.log('Database connection closed.');
  }
};

// Run the script
clearUserCredentials()
  .then(() => {
    console.log('Credential clearing process completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 