const express = require("express");
const router = express.Router();
const assignInvestorController = require("../controllers/assignInvestorController");
const verifyToken = require("../middleware/authMiddleware");

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 15-11-2025
 */

// Apply token verification middleware to all routes
router.use(verifyToken);

// 1) Assign Investor to Project
router.post("/", assignInvestorController.assignInvestor);


//2) Get Assigned Investors for a Project
router.get("/:project_id", assignInvestorController.getAssignedInvestorsByProject);

module.exports = router;