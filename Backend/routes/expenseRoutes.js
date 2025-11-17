const express = require("express");
const router = express.Router();
const ExpenseController = require("../controllers/expenseController");
const verifyToken = require("../middleware/authMiddleware");

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 06-10-2025
 */

// Apply token verification to all expense APIs
router.use(verifyToken);

// 1) POST - Create Expense
router.post("/", ExpenseController.createExpense);

// 2) GET - Get All Expenses
router.get("/", ExpenseController.getAllExpenses);

// 3) GET - Get Expense by ID
router.get("/:expense_id", ExpenseController.getExpenseById);

// 4) PUT - Update Expense by ID
router.put("/:expense_id", ExpenseController.updateExpenseById);

// 5) DELETE - Delete Expense by ID
router.delete("/:expense_id", ExpenseController.deleteExpenseById);

//6) GET - Get Expenses by Employee ID
router.get("/project/:projectId", ExpenseController.getExpensesByProject);

module.exports = router;
