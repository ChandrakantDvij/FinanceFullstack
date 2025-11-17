const ProjectAssignment = require('../models/ProjectAssignment');
const Project = require('../models/Project');
const Employee = require('../models/Employee');

/**
 * @author Vaishnavi Jambhale
 * @version 1.2
 * @since 29-10-2025
 */

class ProjectAssignmentService {

    // 1) Create Project Assignment
    async createAssignment({ project_id, employee_id, assigned_by }) {
        if (!project_id || !assigned_by || !employee_id) {
            throw new Error("Project ID, Assigned By, and Employee ID(s) are required");
        }

        const project = await Project.findOne({ where: { project_id } });
        if (!project) throw new Error("Project not found");

        const employeesToAssign = Array.isArray(employee_id) ? employee_id : [employee_id];
        const assignments = [];

        for (const empId of employeesToAssign) {
            const employee = await Employee.findOne({ where: { employee_id: empId } });
            if (!employee) throw new Error(`Employee not found: ${empId}`);

            const existing = await ProjectAssignment.findOne({
                where: { project_id, employee_id: empId }
            });

            if (existing) continue; 

            const assignment = await ProjectAssignment.create({
                project_id,
                employee_id: empId,
                assigned_by
            });

            assignments.push(assignment);
        }

        if (assignments.length === 0) {
            throw new Error("All provided employees are already assigned to this project");
        }

        return assignments;
    }

    // 2) Get Assignments by Project ID
    async getAssigneesByProjectId(project_id) {
    if (!project_id) throw new Error("Project ID is required");

    const assignments = await ProjectAssignment.findAll({
        where: { project_id },
        include: [
            {
                model: require("../models/Employee"),
                as: "employee",
                attributes: ["employee_id","name"],
            },
            {
                model: require("../models/User"),
                as: "assigner",
                attributes: ["name"], 
            },
        ],
        attributes: ["createdAt"], 
    });

    return assignments;
}
}

module.exports = new ProjectAssignmentService();
