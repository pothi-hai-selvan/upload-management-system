const { sequelize } = require('../config/database');
const User = require('../models/User');

const addAdmin = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connected to database successfully.');

    // Admin credentials
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: {
        email: adminEmail
      }
    });

    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...');
      existingAdmin.password = adminPassword;
      await existingAdmin.save();
      console.log('Admin password updated successfully!');
    } else {
      console.log('Creating new admin user...');
      const newAdmin = await User.create({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log('Admin user created successfully!');
      console.log(`ID: ${newAdmin.id}`);
      console.log(`Name: ${newAdmin.name}`);
      console.log(`Email: ${newAdmin.email}`);
      console.log(`Role: ${newAdmin.role}`);
    }

    // Display all users
    const allUsers = await User.findAll();
    console.log('\nAll users in database:');
    allUsers.forEach(user => {
      console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });
    
    // Close database connection
    await sequelize.close();
    console.log('\nDatabase connection closed.');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Run the script
addAdmin(); 