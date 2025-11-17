const userService = require('../services/userService');

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 29-09-2025
 */

class UserController {
        // 1) Get all users
        async getAllUsers(req, res) {
            try {
                const { page = 1, limit = 10 } = req.query;
                const result = await userService.getAllUsers(page, limit);
                
                res.status(200).json({
                    success: true,
                    message: 'Users retrieved successfully',
                    data: result.users,
                    pagination: result.pagination
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }

    // 2) Get user by ID
    async getUserById(req, res) {
        try {
            // If userId is provided in URL params, use it; otherwise use token user ID
            const userId = req.params.userId || req.user.id;
            const user = await userService.getUserById(userId);
            
            res.status(200).json({
                success: true,
                message: 'User profile retrieved successfully',
                data: user
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    //3)  Update user profile
    async updateUser(req, res) {
        try {
            // If userId is provided in URL params, use it; otherwise use token user ID
            const userId = req.params.userId || req.user.id;
            const updateData = req.body;
            
            const updatedUser = await userService.updateUser(userId, updateData);
            
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: updatedUser
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // 4) Delete user
    async DeleteUser(req, res) {
        try {
            // If userId is provided in URL params, use it; otherwise use token user ID
            const userId = req.params.userId || req.user.id;
            const result = await userService.DeleteUser(userId);
            
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // 5) Forgot password 
    async ForgotPassword(req, res) {
        try {
            const { email } = req.body;
            
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is required'
                });
            }

            const result = await userService.ForgotPassword(email);
            res.status(200).json({
                success: true,
                message: 'Password reset token generated successfully',
                data: {
                    resetToken: result.resetToken,
                    expiresAt: result.expiresAt,
                    note: 'In production, this token will be sent via email'
                }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // 6) Reset password
    async resetPassword(req, res) {
        try {
            const { resetToken, newPassword } = req.body;
            
            if (!resetToken || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Reset token and new password are required'
                });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 6 characters long'
                });
            }

            const result = await userService.resetPassword(resetToken, newPassword);
            
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new UserController();
