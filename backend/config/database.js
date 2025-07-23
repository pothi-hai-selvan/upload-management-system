

const { Sequelize } = require('sequelize');
const path = require('path');
// Load environment variables - only load config.env if it exists (for local development)
try {
  require('dotenv').config({ path: './config.env' });
} catch (error) {
  console.log('No config.env file found in database config, using environment variables from system');
}

// Create database file path
const dbPath = path.join(__dirname, '..', 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite database connection established successfully.');
    
    // Sync all models with database - use force: false to avoid dropping tables
    await sequelize.sync({ force: false });
    console.log('Database models synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB }; 