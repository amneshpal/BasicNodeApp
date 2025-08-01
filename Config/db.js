// // const { Sequelize } = require('sequelize');
// // require('dotenv').config(); // Load environment variables

// // // Initialize Sequelize with environment variables
// // const sequelize = new Sequelize(
// //   process.env.DB_NAME,    // DB name from .env
// //   process.env.DB_USER,    // DB user from .env
// //   process.env.DB_PASSWORD, // DB password from .env
// //   {
// //     host: process.env.DB_HOST,  // DB host from .env
// //     dialect: process.env.DB_DIALECT,  // DB dialect (MySQL, PostgreSQL, etc.)
// //   }
// // );

// // // Function to establish a connection with the database
// // const connectDB = async () => {
// //   try {
// //     await sequelize.authenticate();
// //     console.log('✅ Database connected');
// //   } catch (err) {
// //     console.error('❌ Error in database connection:', err);
// //   }
// // };

// // module.exports = {connectDB,sequelize,};
// const { Sequelize } = require('sequelize');
// require('dotenv').config(); // Load environment variables
// const fs = require('fs');

// // SSL options
// const sslOptions = {
//   ssl: {
//     ca: fs.readFileSync(process.env.DB_SSL_CA_PATH),  // Path to the CA certificate
//   },
// };

// // Initialize Sequelize
// const sequelize = new Sequelize(
//   process.env.DB_NAME,    // DB name from .env
//   process.env.DB_USER,    // DB user from .env
//   process.env.DB_PASSWORD, // DB password from .env
//   {
//     host: process.env.DB_HOST,  // DB host from .env
//     port: process.env.DB_PORT,  // DB port from .env
//     dialect: process.env.DB_DIALECT,  // DB dialect (MySQL)
//     dialectOptions: sslOptions, // Include SSL configuration
//     logging: false,  // Optional: Disable logging
//   }
// );

// // Function to test connection
// const connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('✅ Database connected');
//   } catch (err) {
//     console.error('❌ Error in database connection:', err);
//   }
// };

// // Export sequelize instance
// module.exports = { sequelize, connectDB };



const { Sequelize } = require('sequelize');
require('dotenv').config();
const fs = require('fs');

const useSSL = process.env.DB_SSL === 'true';

let dialectOptions = {};

if (useSSL) {
  dialectOptions = {
    ssl: {
      ca: fs.readFileSync(process.env.DB_SSL_CA_PATH), // Path to CA cert
    },
  };
}

const sequelize = new Sequelize(
  process.env.DB_NAME,    
  process.env.DB_USER,    
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    dialectOptions: useSSL ? dialectOptions : {},
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Error in database connection:', err);
  }
};

module.exports = { sequelize, connectDB };
