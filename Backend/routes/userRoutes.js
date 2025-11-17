const express = require('express');
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 29-09-2025
 */

// Apply token verification middleware to all routes
router.use(verifyToken);

// 1) Get all users
router.get('/', userController.getAllUsers);

// 2) Get user profile by ID
router.get('/profile/:userId', userController.getUserById);

// 3) Update user profile by ID
router.put('/profile/:userId', userController.updateUser);

// 4) Delete user by ID
router.delete('/profile/:userId', userController.DeleteUser);

// 5) Forgot password
router.post('/forgot-password', userController.ForgotPassword);

// 6) Reset password
router.post('/reset-password', userController.resetPassword);

module.exports = router;