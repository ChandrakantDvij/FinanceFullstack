const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 26-09-2025
 */

// 1) Register User
router.post("/register", register);
// 2) Login User
router.post("/login", login);
// 3) Logout User
router.post("/logout", verifyToken, logout);

module.exports = router;
