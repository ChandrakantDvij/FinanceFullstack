const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const verifyToken = require("../middleware/authMiddleware");

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 16-10-2025
 */

// Apply token verification middleware to all routes
router.use(verifyToken);

// 1) Create Employee
router.post("/", employeeController.createEmployee);

// 2) Get All Employees
router.get("/", employeeController.getAllEmployees);

// 3) Get Employee by ID
router.get("/:id", employeeController.getEmployeeById);

// 4) Update Employee By ID
router.put("/:id", employeeController.updateEmployeeById);

// 5) Delete Employee By ID
router.delete("/:id", employeeController.deleteEmployeeById);

module.exports = router;