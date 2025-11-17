const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 06-10-2025
 */

const Expense = sequelize.define("Expense", {
    expense_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expense_type: {
        type: DataTypes.ENUM("advance", "recurring"),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    mode_of_payment: {
    type: DataTypes.ENUM("cash", "bank_transfer", "upi", "cheque", "other"),
    allowNull: false,
},
    expense_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false
},

}, {
    tableName: "expenses",
    timestamps: true,  
    paranoid: true      
});

module.exports = Expense;
