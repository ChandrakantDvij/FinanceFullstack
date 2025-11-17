const EmployeeService = require("../services/employeeService"); // Uppercase here


/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 16-10-2025
 */

class EmployeeController {
  
  // 1) Create Employee
  async createEmployee(req, res) {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

    if (user.role !== "accountant") 
      return res.status(403).json({ success: false, message: "Permission denied" });

    try {
      const employee = await EmployeeService.createEmployee({ 
        ...req.body,
        created_by: user.id 
      });
      
      res.status(201).json({ success: true, employee });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // 2) Get All Employees
  async getAllEmployees(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; 

    const employees = await EmployeeService.getAllEmployees(page, limit);

    res.status(200).json({
      success: true,
      message: "Employees retrieved successfully",
      data: employees.data,
      pagination: {
        currentPage: page,
        totalPages: employees.totalPages,
        totalRecords: employees.totalRecords,
        limit,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

  //3) Get Employee by ID
  async getEmployeeById(req, res) {
    try {
      const {id} = req.params;
      const employee = await EmployeeService.getEmployeeById(id);
      res.status(200).json({ success: true, employee });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  //4) Update Employee By ID
  async updateEmployeeById(req, res) {
    try {
      const {id} = req.params;
      const userId = req.user.id;

      const updateEmployee = await EmployeeService.updateEmployeeById(
        id, req.body, userId);

       res.status(200).json({
        success: true,
        message: "Employee updated successfully",
        data: updateEmployee
      });
    } catch (error) {
      res.status(400).json({
        sucess: false,
        message: error.message,
      })
       }
  }

  //5) Delete Employee By ID
   async deleteEmployeeById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await EmployeeService.deleteEmployeeById(id, userId);

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}
};

module.exports = new EmployeeController();