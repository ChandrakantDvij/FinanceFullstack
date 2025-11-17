const expenService = require("../services/expenseService");

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 06-10-2025
 */

class ExpenseController {

    // 1) Create Expense
    async createExpense(req, res) {
        try {
            const expenseData = req.body;
            const newExpense = await expenService.createExpense(expenseData);
            res.status(201).json({
                sucess: true,
                message: "Expense ctreated successfully",
                data: newExpense
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 2) Get All Expenses
    async getAllExpenses(req, res) {
    try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const expenses = await expenService.getAllExpenses(page, limit);

    res.status(200).json({
      success: true,
      message: "Expenses fetched successfully",
      data: expenses.data,
      pagination: {
        currentPage: page,
        totalPages: expenses.totalPages,
        totalRecords: expenses.totalRecords,
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

    //3) Get Expense by ID
    async getExpenseById(req, res) {
        try {
            const {expense_id} = req.params;
            const expense = await expenService.getExpenseById(expense_id);

            res.status(201).json({
                success: true,
                message: "Expense fetched successfully",
                data: expense
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 4) Update Expense by ID
        async updateExpenseById(req, res) {
             try {
        const { expense_id } = req.params;
        const expenseData = req.body;
        const user = req.user; 

        // Only accountant can update
        if (user.role !== "accountant") {
            return res.status(403).json({
                success: false,
                message: "Only accountants can update expenses"
            });
        }
        const updatedExpense = await expenService.updateExpenseById(expense_id, expenseData,user.id);

        res.status(201).json({
            success: true,
            message: "Expense updated successfully",
            data: updatedExpense
        });
    } catch (error) {
        res.status(500).json({
            success: false, 
            message: error.message
        });
    }
}
    
    //5) Delete Expense by ID
    async deleteExpenseById(req, res) {
        try {
            const {expense_id} = req.params;
            const user = req.user; 

        if (user.role !== "accountant") {
            return res.status(403).json({
                success: false,
                message: "Only accountants can delete expenses"
            });
        }
            const deleted = await expenService.deleteExpenseById(expense_id, user.id);

            res.status(201).json({
                success: true,
                message: "Expense deleted successfully",
                data: deleted
            });
        } catch (error) {   
            res.status(500).json({
                success: false,
                message: error.message
            });
        }   
    }

    // 6) Get Expenses by Project
    async getExpensesByProject(req, res) {
    try {
    const { projectId } = req.params;
    const expenses = await expenService.getExpensesByProject(projectId);

    res.status(200).json({
      success: true,
      message: "Expenses fetched successfully for this project",
      data: expenses,
    });
  } catch (error) {
    console.error("Error fetching expenses by project:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch expenses for this project",
    });
  }
    }
}
module.exports = new ExpenseController();