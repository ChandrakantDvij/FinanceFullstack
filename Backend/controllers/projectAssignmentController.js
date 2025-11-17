const projectAssignmentService = require('../services/projectAssignmentService');

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 29-10-2025
 */

class ProjectAssignmentController {

    // 1) Create Project Assignment
    async createAssignment(req, res) {
        try {
          // ROLE VALIDATION
          if (req.user.role !== "accountant") {
          return res.status(403).json({
          success: false,
          message: "Only accountant can assign investor",
        });
      }
            const {project_id, employee_id} = req.body;
            const assigned_by = req.user.id; 
        
            const assignment = await projectAssignmentService.createAssignment({
                project_id,
                employee_id,
                assigned_by,
            });

            return res.status(201).json({
                success: true,
                message: "Project assigned successfully",
                data: assignment
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 2) Get Assignments by Project ID
    async getAssigneesByProjectId(req, res) {
    try {
        const { project_id } = req.params;

        const assignees = await projectAssignmentService.getAssigneesByProjectId(project_id);

        if (!assignees || assignees.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No assignees found for this project",
            });
        }
        const formattedData = assignees.map(item => ({
            employee_id: item.employee?.employee_id,
            employee_name: item.employee?.name,
            assigned_by: item.assigner?.name,
            createdAt: item.createdAt
        }));

        return res.status(200).json({
            success: true,
            message: "Assignees fetched successfully",
            data: formattedData,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
}

module.exports = new ProjectAssignmentController();