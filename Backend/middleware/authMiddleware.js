const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * author Vaishnavi Jambhale
 * version 1.0
 * since 26-09-2025
 */

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Token missing" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');

        req.user = decoded; // attach user info { id, role }
        next();
    } catch (error) {
        const message = error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
        return res.status(401).json({ success: false, message });
    }
};

module.exports = verifyToken;