const express = require("express");
const router = express.Router();
const ProjectController = require("../controllers/projectController");
const verifyToken = require("../middleware/authMiddleware");

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 29-09-2025
 */

// Apply token verification for all project routes
router.use(verifyToken);

// 1) POST - Create Project
router.post("/", ProjectController.createProject);

// 2) GET - Get All Projects
router.get("/", ProjectController.getAllProjects);

// 3) GET - Get Project by ID
router.get("/:project_id", ProjectController.getProjectById);

// 4) PUT - Update Project by ID
router.put("/:project_id", ProjectController.updateProjectById);

// 5) DELETE - Delete Project by ID
router.delete("/:project_id", ProjectController.deleteProjectById);

module.exports = router;