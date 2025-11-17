const Employee = require("../models/Employee");
const User = require("../models/User");
const { Op } = require("sequelize");

/**
 * @author Vaishnavi
 * @version 1.0
 * @since 16-10-2025
 */

class EmployeeService {

  // 1) Create Employee
  async createEmployee ({ name, email, phone, created_by }) {
      if (!name || !email || !phone )
         throw new Error("All Fileds are required");
      if (!/^[A-Za-z\s]+$/.test(name)) 
        throw new Error("Invalid name");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) 
        throw new Error("Invalid email");
      if (!/^[0-9]{10}$/.test(phone)) 
        throw new Error("Invalid phone number");
      
      const normalizedEmail = email.toLowerCase();

      const exists = await Employee.findOne({
         where: { [Op.or]: [{ email:normalizedEmail }, { phone }] },
         });
      if (exists) throw new Error("Employee already exists");

      const user = await User.findByPk(created_by);
      if(!user || user.role !== "accountant") 
        throw new Error ("Only accountant can create employees");

      return await Employee.create({ name, email, phone, created_by });
  }

  // 2) Get All Employees
   async getAllEmployees(page, limit) {
  const offset = (page - 1) * limit;

  const { count, rows } = await Employee.findAndCountAll({
    offset,
    limit,
    order: [["createdAt", "DESC"]], // optional: newest employees first
  });

  if (!rows || rows.length === 0) {
    throw new Error("No employees found");
  }

  const totalPages = Math.ceil(count / limit);

  return {
    totalRecords: count,
    totalPages,
    data: rows,
  };
}

  //3) Get Employee by ID
  async getEmployeeById(id) {
    const employee = await Employee.findOne({ where: { employee_id: id } });
    if (!employee) {
    throw new Error("Employee not found");
      }
       return employee;
  }

  //4) Update Employee By ID
    async updateEmployeeById(id, data, userId) {
    const user = await User.findByPk(userId);
    if (!user || user.role !== "accountant") {
      throw new Error("Only accountant can update employee details");
    }

    const employee = await Employee.findOne({ where: { employee_id: id } });
    if (!employee) throw new Error("Employee not found");

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      throw new Error("Invalid email format");
    if (data.phone && !/^[0-9]{10}$/.test(data.phone))
      throw new Error("Invalid phone number");

    await employee.update({
      name: data.name ?? employee.name,
      email: data.email?.toLowerCase() ?? employee.email,
      phone: data.phone ?? employee.phone,
    });

    return employee;
  }

  //5) Delete Employee By ID
  async deleteEmployeeById(employee_id, userId) {
    const user = await User.findByPk(userId);
    if (!user || user.role !== "accountant") {
      throw new Error("Only accountant can delete employees");
    }

    const employee = await Employee.findOne({ where: { employee_id } });
    if (!employee) {
      throw new Error("Employee not found");
    }

    await employee.destroy();
    return { message: "Employee deleted successfully" };
  }
}
module.exports = new EmployeeService();