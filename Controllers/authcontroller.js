const env = require("dotenv");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/userModel");


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
};









module.exports = authController;
