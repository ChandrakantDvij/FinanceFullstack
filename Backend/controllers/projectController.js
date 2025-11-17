const projectService = require("../services/projectService");

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 03-20-2025
 */
class ProjectController {
    // 1) Create Project
    async createProject(req, res) {
        try {
            const projectData = req.body;
            const newProject = await projectService.createProject(projectData);

            res.status(201).json({
                success: true,
                message: "Project created successfully",
                data: newProject
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        };
    }

    //2) Get all Projects
    async getAllProjects(req, res) {
    try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 

    const projects = await projectService.getAllProjects(page, limit);

    res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      data: projects.data,
      pagination: {
        currentPage: page,
        totalPages: projects.totalPages,
        totalRecords: projects.totalRecords,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


    //3) Get Project by ID
      async getProjectById(req, res) {
        try {
            const { project_id } = req.params;
            const project = await projectService.getProjectById(project_id);

            res.status(201).json({  
                success: true,
                message: "Project retrieved successfully",
                data: project,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    //4) Update project by ID
    async updateProjectById(req, res) {
    try {
      const { project_id } = req.params;
      const updateData = req.body;

      const updatedProject = await projectService.updateProjectById(project_id, updateData, req.user);

      res.status(200).json({
        success: true,
        message: "Project updated successfully",
        data: updatedProject,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

    // 5) Delete Project by ID
    async deleteProjectById(req, res) {
  try {
    const { project_id } = req.params;
    const user = req.user; 
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized user" });
    }
    const deletedProject = await projectService.deleteProjectById(project_id, user);
    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: deletedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
}

module.exports = new ProjectController();

