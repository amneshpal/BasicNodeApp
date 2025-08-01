const env = require("dotenv");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/userModel");
const { sendMail } = require('../Services/mailer');
// const { sendMail } = require('../services/mailer');

env.config();

const authController = {
    // Register user
    register: async (req, res) => {
        const { name, username, email, password, role } = req.body;

        // Validate input fields
        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Role validation (defaults to 'user' if not specified)
        const validRoles = ['admin', 'user'];
        const userRole = role && validRoles.includes(role.toLowerCase()) ? role.toLowerCase() : 'user';

        try {
            // Check if user already exists by email
            const existingUser = await UserModel.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'User with this email already exists' });
            }

            // Check if user already exists by username
            const existingUsername = await UserModel.findOne({ where: { username } });
            if (existingUsername) {
                return res.status(400).json({ message: 'Username already taken' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user in the database
            const newUser = await UserModel.create({
                name,
                username,
                email,
                password: hashedPassword,
                role: userRole,
                status: 'active',  // New user is active by default
            });

            // Generate JWT token
            const token = jwt.sign(
                { id: newUser.id, email: newUser.email, role: newUser.role },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1h' }
            );

            // Send response with token
            res.status(201).json({
                message: 'User registered successfully!',
                user: newUser,
                token,
            });

        } catch (error) {
            console.error("Error in register function:", error.stack);

            res.status(500).json({
                message: 'Something went wrong. Please try again.',
                error: error.message,
            });
        }
    },



 login: async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Check if user exists
        const user = await UserModel.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Send success response
        res.status(200).json({
            message: 'Login successful!',
            user,
            token,
        });

    } catch (error) {
        console.error("Error in login function:", error.stack);
        res.status(500).json({
            message: 'Something went wrong. Please try again.',
            error: error.message,
        });
    }
},

 forgotPassword: async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    try {
      const user = await UserModel.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Create a reset token valid for 15 minutes
      const resetToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );

      const resetLink = `${process.env.API_URL}/api/reset-password?token=${resetToken}`;

      // Prepare the email template data
      const templateData = {
        name: user.name,
        resetLink,
      };

      // Send the reset password email
      await sendMail(email, 'Reset Your Password', templateData);

      res.status(200).json({  message: 'Reset link sent to email',resetToken });

    } catch (err) {
      console.error('Error in forgotPassword:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },


// resetPassword: async (req, res) => {
//   const { newPassword } = req.body;

//   if (!newPassword) {
//     return res.status(400).json({ message: 'New password is required' });
//   }

//   try {
//     // Get user ID from verifyToken middleware
//     const userId = req.user.id;

//     // Find the user by ID
//     const user = await UserModel.findOne({ where: { id: userId } });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update the user's password in the database
//     user.password = hashedPassword;
//     await user.save();

//     res.status(200).json({ message: 'Password successfully reset' });

//   } catch (err) {
//     console.error('Error in resetPassword:', err);
//     res.status(500).json({ message: 'Something went wrong' });
//   }
// },


resetPassword: async (req, res) => {
  const authHeader = req.headers.authorization || '';
  const tokenFromHeader = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const token = req.body.token || tokenFromHeader;
  const { newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).send('Token and new password are required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await UserModel.findOne({ where: { id: decoded.id } });
    if (!user) return res.status(404).send('User not found');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.send('Password has been successfully reset');
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(400).send('Invalid or expired token');
  }
},


    // logout: async (res, res) => {

    // },


    // delete: async (res, res) => {

    // },

    // softdelete: async (res, res) => {

    // },

    // softdelete: async (res, res) => {

    // },
    // updatePassword: async (res, res) => {

    // },
    // resetPassword: async (res, res) => {

    // },


}


module.exports = authController;
