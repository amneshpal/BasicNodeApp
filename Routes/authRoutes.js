const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authcontroller');  // Correct import
const{verifyToken} = require('../Middleware/verifytoken');  // Correct import
  // Import the middleware

router.post('/register', authController.register);  // Registration does not require authentication
// router.post('/login', authController.login);  // Login does not require authentication
// router.post('/forgetPassword', authController.forgetPassword);  // Forget password does not require authentication
// router.post('/logout', verifyToken, authController.logout);  // Protected route
// router.post('/delete', verifyToken, authController.delete);  // Protected route
// router.post('/softdelete', verifyToken, authController.softdelete);  // Protected route
// router.post('/recoversoftdelete', verifyToken, authController.recoversoftdelete);  // Protected route
// router.post('/updatePassword', verifyToken, authController.updatePassword);  // Protected route
// router.post('/resetPassword', verifyToken, authController.resetPassword);  // Protected route

module.exports = {router};
