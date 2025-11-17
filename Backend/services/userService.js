const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 29-09-2025
 */

const userService = {
        // 1) Get all users 
        getAllUsers: async (page = 1, limit = 10) => {
            const offset = (page - 1) * limit;
            
            const { count, rows: users } = await User.findAndCountAll({
                attributes: { exclude: ['password', 'resetPasswordToken'] },
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['createdAt', 'DESC']]
            });
    
            return {
                users,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    totalUsers: count,
                    hasNext: page * limit < count,
                    hasPrev: page > 1
                }
            };
        },
        
    // 2) Get user by ID
    getUserById: async (userId) => {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });
        
        if (!user) {
            throw new Error('User not found');
        }
        
        return user;
    },

    // 3) Update user profile
    updateUser: async (userId, updateData) => {
        console.log('Update request received:', { userId, updateData }); // Debug log
        
        const { name, email, phone, currentPassword, newPassword } = updateData;
        
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        console.log('Found user:', { id: user.id, currentEmail: user.email }); // Debug log

        // Check if email is being updated and if it already exists
        if (email && email !== user.email) {
            console.log('Checking for duplicate email:', email); // Debug log
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new Error('Email already exists');
            }
        }

        // If password is being updated, verify current password
        if (newPassword) {
            if (!currentPassword) {
                throw new Error('Current password is required to update password');
            }
            
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                throw new Error('Current password is incorrect');
            }
            
            // Hash new password
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedNewPassword;
        }

        // Update other fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;

        console.log('Before save:', { name: user.name, email: user.email, phone: user.phone }); // Debug log

        await user.save();

        console.log('After save - user updated'); // Debug log

        // Return user without password
        const { password, ...userWithoutPassword } = user.toJSON();
        return userWithoutPassword;
    },

    // 4) Soft delete user (deactivate account)
    DeleteUser: async (userId) => {
        console.log('DeleteUser called with userId:', userId); // Debug log
        
        // Find user including soft deleted ones to check if already deleted
        const user = await User.findByPk(userId, { paranoid: false });
        if (!user) {
            throw new Error('User not found');
        }

        console.log('Found user before delete:', { id: user.id, deletedAt: user.deletedAt }); // Debug log

        // Check if user is already soft deleted
        if (user.deletedAt) {
            throw new Error('User is already deleted');
        }

        // Soft delete the user
        console.log('Calling destroy() on user...'); // Debug log
        await user.destroy(); // This will set deletedAt timestamp
        
        console.log('User destroyed, checking deletedAt...'); // Debug log
        
        // Reload user to check if deletedAt was set
        await user.reload({ paranoid: false });
        console.log('User after delete:', { id: user.id, deletedAt: user.deletedAt }); // Debug log
        
        return { message: 'User account deactivated successfully' };
    },

    // 5) Forgot password
    ForgotPassword: async (email) => {
        console.log('ForgotPassword called with email:', email); // Debug log
        
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('User with this email does not exist');
        }

        console.log('Found user:', { id: user.id, email: user.email }); // Debug log

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

        console.log('Generated token:', { resetToken: resetToken.substring(0, 10) + '...', expiresAt: resetTokenExpiry }); // Debug log

        // Store reset token in user record
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        
        console.log('Before save - user fields:', { 
            resetPasswordToken: user.resetPasswordToken ? user.resetPasswordToken.substring(0, 10) + '...' : null,
            resetPasswordExpires: user.resetPasswordExpires 
        }); // Debug log
        
        await user.save();
        
        console.log('User saved successfully'); // Debug log

        // Verify the save worked
        const updatedUser = await User.findByPk(user.id);
        console.log('After save - database check:', {
            resetPasswordToken: updatedUser.resetPasswordToken ? updatedUser.resetPasswordToken.substring(0, 10) + '...' : null,
            resetPasswordExpires: updatedUser.resetPasswordExpires
        }); // Debug log

        return {
            resetToken,
            email: user.email,
            expiresAt: resetTokenExpiry
        };
    },

    // 6) Reset password 
    resetPassword: async (resetToken, newPassword) => {
        if (!resetToken || !newPassword) {
            throw new Error('Reset token and new password are required');
        }

        // Find user with valid reset token
        const user = await User.findOne({
            where: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: {
                    [require('sequelize').Op.gt]: new Date()
                }
            }
        });

        if (!user) {
            throw new Error('Invalid or expired reset token');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        return { message: 'Password reset successfully' };
    },


};

module.exports = userService;
