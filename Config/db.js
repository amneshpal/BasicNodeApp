const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables

// Initialize Sequelize with environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,    // DB name from .env
  process.env.DB_USER,    // DB user from .env
  process.env.DB_PASSWORD, // DB password from .env
  {
    host: process.env.DB_HOST,  // DB host from .env
    dialect: process.env.DB_DIALECT,  // DB dialect (MySQL, PostgreSQL, etc.)
  }
);

// Function to establish a connection with the database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Error in database connection:', err);
  }
};

module.exports = {connectDB,sequelize,};
