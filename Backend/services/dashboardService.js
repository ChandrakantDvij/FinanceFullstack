const User = require('../models/User');
const Project = require('../models/Project');
const Employee = require('../models/Employee');
const Investor = require('../models/Investor');
const Expense = require('../models/Expense');
const ExpenseReview = require('../models/ExpenseReview');
const ProjectAssignment = require('../models/ProjectAssignment');

/**
 * @author Vaishnavi
 * @version 1.0
 * @since 3-11-2025
 */

class DashboardService {

    // 1) Get Dashboard Summary
    async getOverview() {
    const totalProjects = await Project.count({ where: { deletedAt: null } });
    const totalEmployees = await Employee.count({ where: { deletedAt: null } });
    const totalInvestors = await Investor.count({ where: { deletedAt: null } });
    const totalExpenses = await Expense.count({ where: { deletedAt: null } });
    const totalAssignments = await ProjectAssignment.count({ where: { deletedAt: null } });

    const approvedExpenses = await ExpenseReview.count({ where: { status: "approved", deletedAt: null } });
    const pendingExpenses = await ExpenseReview.count({ where: { status: "pending", deletedAt: null } });
    const rejectedExpenses = await ExpenseReview.count({ where: { status: "rejected", deletedAt: null } });

    return {
      totalProjects,
      totalEmployees,
      totalInvestors,
      totalExpenses,
      totalAssignments,
      expenseReviewStats: {
        approved: approvedExpenses,
        pending: pendingExpenses,
        rejected: rejectedExpenses,
      },
    };
  } 

  // 2) Get All Projects Overview
    async getAllProjectsOverview() {
    const projects = await Project.findAll({
      where: { deletedAt: null },
      attributes: [
        "project_id",
        "name",
        "location",
        "department",
        "sub_department",
        "product",
        "estimated_budget",
        "start_date",
        "end_date",
        "status",
      ],
    });

    const projectSummaries = [];

    for (const project of projects) {
      const projectId = project.project_id;

      const assignedEmployees = await ProjectAssignment.findAll({
        where: { project_id: projectId },
        include: [
          {
            model: Employee,
            as: "employee",
            attributes: ["employee_id", "name", "email", "phone", "role"],
          },
        ],
      });

      const expenses = await Expense.findAll({
        where: { project_id: projectId },
        attributes: ["expense_id", "title", "amount", "expense_type", "mode_of_payment", "expense_date"],
      });
      const totalExpense = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

      const investors = await Investor.findAll({
        where: { project_id: projectId },
        attributes: ["investor_id", "name", "email", "phone", "invested_amount", "mode_of_payment", "status", "investment_date"],
      });
      const totalInvestment = investors.reduce((sum, i) => sum + parseFloat(i.invested_amount || 0), 0);

      const balance = totalInvestment - totalExpense;

      projectSummaries.push({
        project,
        employees: assignedEmployees.map((a) => a.employee),
        expenses: {
          totalExpense,
          expenseCount: expenses.length,
        },
        investors: {
          totalInvestment,
          investorCount: investors.length,
        },
        balance: {
          totalInvestment,
          totalExpense,
          netBalance: balance,
          profitOrLoss: balance >= 0 ? "Profit" : "Loss",
        },
      });
    }
    return projectSummaries;
  }

  // 3)  Get Project Summary
  async getProjectAnalytics(projectId) {
    // a) Find project
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // b) Get employees assigned to project
    const assignedEmployees = await ProjectAssignment.findAll({
      where: { project_id: projectId },
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["employee_id", "name", "email", "phone", "role"],
        },
      ],
    });

    // c) Get project expenses and total spent
    const expenses = await Expense.findAll({
      where: { project_id: projectId },
      attributes: [
        "expense_id",
        "title",
        "amount",
        "expense_type",
        "mode_of_payment",
        "expense_date",
      ],
    });

    const totalExpense = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

    // d) Get investors and total investment
    const investors = await Investor.findAll({
      where: { project_id: projectId },
      attributes: [
        "investor_id",
        "name",
        "email",
        "phone",
        "invested_amount",
        "mode_of_payment",
        "status",
        "investment_date",
      ],
    });

    const totalInvestment = investors.reduce((sum, i) => sum + parseFloat(i.invested_amount || 0), 0);

    // e) Calculate profit/loss
    const balance = totalInvestment - totalExpense;

    // f) Return final analytics object
    return {
      project: {
        id: project.project_id,
        name: project.name,
        location: project.location,
        department: project.department,
        sub_department: project.sub_department,
        product: project.product,
        estimated_budget: project.estimated_budget,
        start_date: project.start_date,
        end_date: project.end_date,
        status: project.status,
      },
      employees: assignedEmployees.map((a) => a.employee),
      expenses: {
        totalExpense,
        expenseCount: expenses.length,
        details: expenses,
      },
      investors: {
        totalInvestment,
        investorCount: investors.length,
        details: investors,
      },
      balance: {
        totalInvestment,
        totalExpense,
        netBalance: balance,
        profitOrLoss: balance >= 0 ? "Profit" : "Loss",
      },
    };
  }
}

module.exports = new DashboardService();