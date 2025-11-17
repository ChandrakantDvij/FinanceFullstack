const assignInvestorService = require("../services/assignInvestorService");

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 15-11-2025
 */

class AssignInvestorController {
  
  //1) Assign Investor to Project
    async assignInvestor(req, res) {
    try {
      if (req.user.role !== "accountant") {
        return res.status(403).json({
          success: false,
          message: "Only accountant can assign investor",
        });
      }

      const { project_id, investor_id } = req.body;
      const assigned_by = req.user.id;

      const assignment = await assignInvestorService.assignInvestor({
        project_id,
        investor_id,
        assigned_by,
      });

      return res.status(201).json({
        success: true,
        message: "Investor assigned successfully",
        data: assignment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  //2) Get Assigned Investors for a Project
   async getAssignedInvestorsByProject(req, res) {
    try {
      const { project_id } = req.params;

      const investors = await assignInvestorService.getAssignedInvestorsByProjectId(project_id);

      return res.status(200).json({
        success: true,
        message: "Assigned investors fetched successfully",
        data: investors,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AssignInvestorController();
