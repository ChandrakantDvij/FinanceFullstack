const express = require("express");
const router = express.Router();
const investorController = require("../controllers/investorController");
const verifyToken = require("../middleware/authMiddleware");

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 09-10-2025
 */

// Apply authentication middleware for all investor APIs
router.use(verifyToken);

// 1) POST - Create Investor
router.post("/", investorController.createInvestor);

// 2) GET - Get All Investors
router.get("/", investorController.getAllInvestors);

// 3) GET - Get Investor by ID
router.get("/:investor_id", investorController.getInvestorById);

// 4) PUT - Update Investor by ID
router.put("/:investor_id", investorController.updateInvestorById);

// 5) DELETE - Delete Investor by ID
router.delete("/:investor_id", investorController.deleteInvestorById);

module.exports = router;