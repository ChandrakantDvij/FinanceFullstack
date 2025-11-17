const dashboardService = require('../services/dashboardService');

/**
 * @author Vaishnavi
 * @version 1.0
 * @since 3-11-2025
 */

class DashboardController {

    // 1) Get Dashboard Summary
    async getOverview(req, res) {
        try {
            const overview = await dashboardService.getOverview();
            res.status(200).json(overview);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
      } 

    // 2) Get All Projects Overview
    async getAllProjectsOverview(req, res) {
      try {
        const data= await dashboardService.getAllProjectsOverview();
        res.status(200).json({
        success: true,
        message: "All projects overview fetched successfully",
        data,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to fetch all projects overview",
        });
      }
    }

    // 3) Get Project Summary
    async getProjectAnalytics(req, res) {
    try {
      const { projectId } = req.params;
      const data = await dashboardService.getProjectAnalytics(projectId);

      return res.status(200).json({
        success: true,
        message: "Project analytics fetched successfully",
        data,
      });
    } catch (error) {
      console.error("Error in getProjectAnalytics:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch project analytics",
      });
    }
  }  
}

module.exports = new DashboardController();