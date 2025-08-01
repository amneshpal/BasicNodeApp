// const express = require('express');
// const {connectDB} = require('./Config/db')
// const { router: authRouter } = require('./Routes/authRoutes'); // Import router once
// const UserModel = require('./Models/userModel');

// const app = express();
// // Middleware for parsing JSON
// app.use(express.json());

// // Define Routes (use the imported authRouter here)

// app.get('/', (req, res) => {
//   res.send('Welcome to the Novartis Backend API');
// });

// app.use('/api', authRouter);


// // Sync User Model (force: false to avoid dropping tables in production)
// const start = async () => {
//   connectDB();
//   await UserModel.sync({ alter: true });

// //   await Case.sync({ alter: true });
// //   await UserCase.sync({ alter: true });
//   console.log("User table synced");
//   app.listen(3000, () => {
//     console.log("app started on port 3000");
//   });
// };

// start();


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDB } = require('./Config/db');  // Database connection
const { router: authRouter } = require('./Routes/authRoutes');  // Auth routes
const UserModel = require('./Models/userModel');// Import your User model

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());  // To parse JSON bodies

app.get('/',(req, res)=>{
  res.send('Welcome to the Novartis Backend API');
})
// Routes
app.use('/api', authRouter);

const start = async () => {
  try {
    await connectDB();  // Connect to DB

    // Sync your User table to DB, altering schema if needed
    await UserModel.sync({ force: true });
    console.log('User table synced');

    // If you have other models to sync, you can do that here
    // await Case.sync({ alter: true });
    // await UserCase.sync({ alter: true });
    // console.log("Other tables synced");

    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};
start();
