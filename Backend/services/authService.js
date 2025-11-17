const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * @author Vaishnavi
 * @version 1.0
 * @since 26-09-2025
 */

class AuthService {

  // 1) Register user
  async register({ name, email, phone, password, role }) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new Error(`User with email ${email} already exists`);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name, email, phone, password: hashedPassword, role
    });

    return newUser;
  }

  // 2) Login user
  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error(`User with email ${email} not found`);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid password');

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });

    return { user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }, token };
  }

  // 3) Logout user
  async logout(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
      const user = await User.findByPk(decoded.id);
      if (!user) throw new Error('User not found');

      return { id: decoded.id, role: decoded.role, message: 'Token verified successfully' };
    } catch (error) {
      throw new Error(error.message || 'Token verification failed');
    }
  }
}

module.exports = new AuthService();
