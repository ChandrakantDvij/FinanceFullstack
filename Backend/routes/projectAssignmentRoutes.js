const express = require("express");
const router = express.Router();
const projectAssignmentController = require("../controllers/projectAssignmentController");
const verifyToken = require("../middleware/authMiddleware");

/**
 * @author Vaishnavi
 * @version 1.0
 * @since 28-10-2025
 */
// Apply token verification middleware to all routes
router.use(verifyToken);

// 1) POST - Create Project Assignment (Protected)
router.post("/",  projectAssignmentController.createAssignment);

// 2) GET - Get Assignments by Project ID (Protected)
router.get("/project/:project_id", projectAssignmentController.getAssigneesByProjectId);

module.exports = router;
