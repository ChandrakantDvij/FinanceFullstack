const authService = require("../services/authService");

/**
 * @author Vaishnavi
 * @version 1.0
 * @since 26-09-2025
 */

class AuthController {

  // 1) Register User
  async register(req, res) {
    try {
      const { name, email, phone, password, role } = req.body;
      const user = await authService.register({ name, email, phone, password, role });

      res.status(201).json({
        success: true,
        message: `${user.role} registered successfully`,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // 2) Login User
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        message: "Login successful",
        token: result.token,
        user: result.user
      });
    } catch (error) {
      res.status(401).json({ success: false, message: error.message });
    }
  }

  // 3) Logout User
     async logout(req, res) {
     try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(400).json({ success: false, message: "Token is required" });
      }

      const token = authHeader.split(" ")[1];
      const result = await authService.logout(token);

      res.status(200).json({
        success: true,
        message: "Logout successful",
        data: { userId: result.id, timestamp: new Date().toISOString() }
      });
    } catch (error) {
      res.status(401).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AuthController();