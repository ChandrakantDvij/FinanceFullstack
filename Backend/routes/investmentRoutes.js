const express = require("express");
const router = express.Router();
const InvestmentController = require("../controllers/investmentController");
const verifyToken = require("../middleware/authMiddleware");

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 15-11-2025
 */

// Apply authentication middleware for all investment APIs
router.use(verifyToken);

// 1) POST - Create Investment
router.post("/", InvestmentController.createInvestment);

// 2) GET - Get Investments by Project ID
router.get("/project/:project_id", InvestmentController.getInvestorsByProject);

module.exports = router;