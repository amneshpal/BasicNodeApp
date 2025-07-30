const express = require('express');
const {connectDB} = require('./Config/db')
const { router: authRouter } = require('./Routes/authRoutes'); // Import router once
const UserModel = require('./Models/userModel');
const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Define Routes (use the imported authRouter here)

app.get('/', (req, res) => {
  res.send('Welcome to the Novartis Backend API');
});

app.use('/api', authRouter);

// Sync User Model (force: false to avoid dropping tables in production)
const start = async () => {
  connectDB();
  await UserModel.sync({ alter: true });
//   await Case.sync({ alter: true });
//   await UserCase.sync({ alter: true });
  console.log("User table synced");
  app.listen(3000, () => {
    console.log("app started on port 3000");
  });
};

start();
