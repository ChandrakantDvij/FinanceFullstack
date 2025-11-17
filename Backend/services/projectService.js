const Project = require("../models/Project");
const User = require("../models/User"); 

/**
 * @author Vaishnavi
 * @version 1.0
 * @since 03-20-2025
 */

class ProjectService {

  // 1) Create Project
async createProject(projectData) {
  const { name, product, quantity, estimated_budget, created_by, start_date, end_date } = projectData;

  if (!name || !product || !quantity || !estimated_budget || !created_by) {
    throw new Error("Missing required fields: name, product, quantity, estimated_budget, created_by");
  }
  const existingProject = await Project.findOne({ where: { name } });
  if (existingProject) throw new Error("Project with this name already exists");

  if (start_date && end_date && new Date(end_date) < new Date(start_date)) {
    throw new Error("end_date must be greater than start_date");
  }
  return await Project.create(projectData);
}

  // 2) Get All Projects
async getAllProjects(page, limit) {
  const offset = (page - 1) * limit;

  const { count, rows } = await Project.findAndCountAll({
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });

  if (!rows || rows.length === 0) {
    throw new Error("No projects found");
  }

  const totalPages = Math.ceil(count / limit);

  return {
    totalRecords: count,
    totalPages,
    data: rows,
  };
}

  // 3) Get Project by ID
  async getProjectById(project_id) {
    const project = await Project.findOne({ where: { project_id } });
    if (!project) throw new Error("Project not found");
    return project;
  }

  // 4) Update Project by ID
    async updateProjectById(project_id, updateData, user) {

    if (!user) throw new Error("Unauthorized user");
    if (user.role !== "accountant") throw new Error("Only accountants can update projects");

    const project = await Project.findByPk(project_id);
    if (!project) throw new Error("Project not found");

    delete updateData.project_id;
    delete updateData.created_by;

    const updatedProject = await project.update(updateData);
    return updatedProject;
  }

  // 5) Delete Project by ID
   async deleteProjectById(project_id, user) {
    
    if (!user) throw new Error("Unauthorized user");
    if (user.role !== "accountant") throw new Error("Only accountants can delete projects");

    const project = await Project.findByPk(project_id);
    if (!project) throw new Error("Project not found");

    await project.destroy();
    return project;
  }
}

module.exports = new ProjectService();