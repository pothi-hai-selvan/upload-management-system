const { sequelize } = require('../config/database');
const User = require('../models/User');

const checkDatabase = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connected to database successfully.');

    // Check all users
    const allUsers = await User.findAll();
    console.log(`\nFound ${allUsers.length} user(s) in database:`);
    
    if (allUsers.length === 0) {
      console.log('No users found in database.');
    } else {
      allUsers.forEach(user => {
        console.log(`- ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
      });
    }

    // Check specifically for admin users
    const adminUsers = await User.findAll({
      where: { role: 'admin' }
    });
    
    console.log(`\nFound ${adminUsers.length} admin user(s):`);
    adminUsers.forEach(admin => {
      console.log(`- ID: ${admin.id}, Name: ${admin.name}, Email: ${admin.email}, Role: ${admin.role}`);
    });

    // Test admin login credentials
    const testEmail = 'admin@gmail.com';
    const testPassword = 'admin123';
    
    console.log(`\nTesting admin login with email: ${testEmail}`);
    const admin = await User.findOne({
      where: { 
        email: testEmail,
        role: 'admin'
      }
    });

    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log('Creating admin user...');
      
      const newAdmin = await User.create({
        name: 'Admin',
        email: testEmail,
        password: testPassword,
        role: 'admin'
      });
      
      console.log('✅ Admin user created successfully!');
      console.log(`ID: ${newAdmin.id}, Email: ${newAdmin.email}, Role: ${newAdmin.role}`);
    } else {
      console.log('✅ Admin user found!');
      console.log(`ID: ${admin.id}, Email: ${admin.email}, Role: ${admin.role}`);
      
      // Test password
      const isPasswordValid = await admin.comparePassword(testPassword);
      if (isPasswordValid) {
        console.log('✅ Password is correct!');
      } else {
        console.log('❌ Password is incorrect! Updating password...');
        admin.password = testPassword;
        await admin.save();
        console.log('✅ Password updated successfully!');
      }
    }
    
    // Close database connection
    await sequelize.close();
    console.log('\nDatabase connection closed.');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Run the script
checkDatabase(); 