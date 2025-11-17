const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const verifyToken = require('../middleware/authMiddleware');

/**
 * @author Vaishnavi
 * @version 1.0
 * @since 3-11-2025
 */

// Apply token verification middleware to all routes
router.use(verifyToken);

// 1) Get Dashboard Summary
router.get('/overview',  DashboardController.getOverview);

// 2) Get All Projects Overview
router.get('/projects/all', DashboardController.getAllProjectsOverview);

// 3) Get Project Summary
router.get("/project/:projectId", DashboardController.getProjectAnalytics);

module.exports = router;