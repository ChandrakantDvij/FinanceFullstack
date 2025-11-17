const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * @author Vaishnavi
 * @version 1.0
 * @since 01-11-2025
 */

const ExpenseReview = sequelize.define("ExpenseReview", {
  review_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  expense_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reviewer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    allowNull: false,
    defaultValue: "pending",
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: "expense_reviews",
  timestamps: true,   
  paranoid: true,     
});

module.exports = ExpenseReview;
