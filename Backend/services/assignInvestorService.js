const AssignInvestor = require("../models/AssignInvestor");
const Project = require("../models/Project");
const Investor = require("../models/Investor");
const User = require("../models/User");

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 15-11-2025
 */

class AssignInvestorService {

  // 1) Assign investor(s) to a project
  async assignInvestor({ project_id, investor_id, assigned_by }) {
    if (!project_id || !assigned_by || !investor_id) {
      throw new Error("Project ID, Assigned By, and Investor ID(s) are required");
    }
    const project = await Project.findOne({ where: { project_id } });
    if (!project) throw new Error("Project not found");
    const investorsToAssign = Array.isArray(investor_id) ? investor_id : [investor_id];
    const assignments = [];

    for (const invId of investorsToAssign) {
      const investor = await Investor.findOne({ where: { investor_id: invId } });
      if (!investor) throw new Error(`Investor not found: ${invId}`);

      const existing = await AssignInvestor.findOne({
        where: { project_id, investor_id: invId },
      });

      if (existing) continue;

      const assignment = await AssignInvestor.create({
        project_id,
        investor_id: invId,
        assigned_by,
      });

      assignments.push(assignment);
    }

    if (assignments.length === 0) {
      throw new Error("All provided investors are already assigned to this project");
    }

    return assignments;
  }

  // 2) Get assigned investors for a project
     async getAssignedInvestorsByProjectId(project_id) {
    if (!project_id) throw new Error("Project ID is required");

    const assignments = await AssignInvestor.findAll({
      where: { project_id },
      include: [
        {
          model: Investor,
          as: "investor",
          attributes: ["investor_id", "name", "email", "phone"],
        },
        {
          model: User,
          as: "assignedBy",
          attributes: ["id"],
        },
      ],
      attributes: ["assign_id", "createdAt", "updatedAt"],
    });

    return assignments;
  }
}

module.exports = new AssignInvestorService();
