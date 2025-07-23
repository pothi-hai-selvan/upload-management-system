const { connectDB } = require('../config/database');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

const initDatabase = async () => {
  try {
    await connectDB();
    
    // Always upsert the test user
    const passwordHash = await bcrypt.hash('123', 10);
    const [user, created] = await User.findOrCreate({
      where: { email: 'pothihais@gmail.com' },
      defaults: {
        name: 'pothihai selvan s p',
        email: 'pothihais@gmail.com',
        password: passwordHash,
        role: 'user',
      },
    });
    if (!created) {
      user.name = 'pothihai selvan s p';
      user.password = passwordHash;
      await user.save();
    }

    // Always upsert the admin user
    const adminPasswordHash = await bcrypt.hash('ramya@123', 10);
    const [admin, adminCreated] = await User.findOrCreate({
      where: { email: 'ramya@gmail.com' },
      defaults: {
        name: 'Ramya',
        email: 'ramya@gmail.com',
        password: adminPasswordHash,
        role: 'admin',
      },
    });
    if (!adminCreated) {
      admin.name = 'Ramya';
      admin.password = adminPasswordHash;
      admin.role = 'admin';
      await admin.save();
    }

    console.log('Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

initDatabase(); 