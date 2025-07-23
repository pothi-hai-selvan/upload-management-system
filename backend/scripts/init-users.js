const { sequelize } = require('../config/database');
const User = require('../models/User');

const initUsers = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connected to database successfully.');

    // Sync models
    await sequelize.sync({ force: false });
    console.log('Database models synchronized.');

    // Test users data
    const users = [
      {
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        name: 'Test User',
        email: 'user@gmail.com',
        password: 'user123',
        role: 'user'
      },
      {
        name: 'John Doe',
        email: 'john@gmail.com',
        password: 'john123',
        role: 'user'
      }
    ];

    console.log('Creating/updating users...');

    for (const userData of users) {
      // Check if user already exists
      const existingUser = await User.findOne({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`Updating existing user: ${userData.email}`);
        existingUser.name = userData.name;
        existingUser.password = userData.password;
        existingUser.role = userData.role;
        await existingUser.save();
      } else {
        console.log(`Creating new user: ${userData.email}`);
        await User.create(userData);
      }
    }

    // Display all users
    const allUsers = await User.findAll({
      attributes: ['id', 'name', 'email', 'role']
    });
    
    console.log('\nAll users in database:');
    allUsers.forEach(user => {
      console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });
    
    // Close database connection
    await sequelize.close();
    console.log('\nDatabase connection closed.');
    console.log('\n✅ Database initialized successfully!');
    console.log('\nTest Credentials:');
    console.log('Admin: admin@gmail.com / admin123');
    console.log('User: user@gmail.com / user123');
    console.log('User: john@gmail.com / john123');
    
  } catch (error) {
    console.error('Error initializing users:', error);
    process.exit(1);
  }
};

// Run the script
initUsers(); 