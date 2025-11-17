const Expense = require("../models/Expense");
const User = require("../models/User");
const Employee = require("../models/Employee");
const Project = require("../models/Project");

/**
 * @author Vaishnavi
 * @version 1.0
 * @since 06-10-2025
 */

class ExpenseService {

  // 1) Create Expense
  async createExpense(expenseData) {
    const { project_id, expense_type, title, amount, mode_of_payment, expense_date, created_by, employee_id } = expenseData;

    if (!project_id || !expense_type || !title || !amount || !mode_of_payment || !expense_date || !created_by || !employee_id) {
      throw new Error("All fields are required");
    }

    const user = await User.findByPk(created_by);
    if (!user) throw new Error("User not found.");
    if (user.role !== "accountant") {
      throw new Error("Only accountants are allowed to create expenses.");
    }
    const newExpense = await Expense.create(expenseData);
    return newExpense;
  }

  // 2) Get All Expenses
  async getAllExpenses(page, limit) {
  const offset = (page - 1) * limit;

  const { count, rows } = await Expense.findAndCountAll({
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });

  if (!rows || rows.length === 0) {
    throw new Error("No expenses found");
  }

  const totalPages = Math.ceil(count / limit);

  return {
    totalRecords: count,
    totalPages,
    data: rows,
  };
}

  // 3) Get Expense by ID
  async getExpenseById(expense_id) {
    const expense = await Expense.findOne({ where: { expense_id } });
    if (!expense) throw new Error("Expense not found");
    return expense;
  }

  // 4) Update Expense by ID
  async updateExpenseById(expense_id, expenseData) {
    const expense = await Expense.findByPk(expense_id);
    if (!expense) throw new Error("Expense not found");

    // Prevent updating project_id
     if (expenseData.created_by && expenseData.created_by !== expense.created_by) {
        throw new Error("Created_by cannot be updated.");
    }

    const updatedExpense = await expense.update(expenseData);
    return updatedExpense;
  }

  // 5) Delete Expense by ID
  async deleteExpenseById(expense_id) {
    const expense = await Expense.findByPk(expense_id);
    if (!expense) throw new Error("Expense not found");

    await Expense.destroy({ where: { expense_id } });
    return expense;
  }

  // 6) Get Expenses by Project ID
   async getExpensesByProject(project_id) {
   try {
    // 1️⃣ Fetch all expenses for the given project_id
    const expenses = await Expense.findAll({
      where: { project_id },
      order: [["createdAt", "DESC"]],
    });

    if (!expenses || expenses.length === 0) {
      throw new Error("No expenses found for this project");
    }

    // 2️⃣ Fetch project details
    const project = await Project.findByPk(project_id, {
      attributes: ["project_id", "name"],
    });

    // 3️⃣ Create response with employee and project info
    const response = [];
    for (const expense of expenses) {
      // Fetch employee info
      const employee = await Employee.findByPk(expense.employee_id, {
        attributes: ["employee_id", "name"],
      });

      response.push({
        expense_id: expense.expense_id,
        title: expense.title,
        amount: expense.amount,
        date: expense.date,
        category: expense.category,
        description: expense.description,
        employee_id: employee ? employee.employee_id : null,
        employee_name: employee ? employee.name : null,
        project_id: project ? project.project_id : null,
        name: project ? project.name : null,
      });
    }

    return response;
  } catch (error) {
    console.error("Error in getExpensesByProject:", error);
    throw error;
  }
}
}

module.exports = new ExpenseService();