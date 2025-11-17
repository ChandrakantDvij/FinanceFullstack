const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Investor = require('./Investor');
const Project = require('./Project');
const User = require('./User');

/**
 * @author 
 * @version 2.0
 * @since 15-10-2025
 */

const Investment = sequelize.define("Investment", {
  investment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  investor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Investor, key: "investor_id" }
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Project, key: "project_id" }
  },
  invested_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  mode_of_payment: {
    type: DataTypes.ENUM("cash", "bank_transfer", "upi", "cheque", "other"),
    allowNull: false
  },
  investment_type: {
    type: DataTypes.ENUM("self", "other"),
    allowNull: false
  },
  investment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: "id" } 
  }
}, {
  tableName: "investments",
  timestamps: true,
  paranoid: true
});

// Associations
Investor.hasMany(Investment, { foreignKey: "investor_id", as: "Investments" });
Investment.belongsTo(Investor, { foreignKey: "investor_id", as: "Investor" });

Project.hasMany(Investment, { foreignKey: "project_id", as: "Investments" });
Investment.belongsTo(Project, { foreignKey: "project_id", as: "Project" });

User.hasMany(Investment, { foreignKey: "created_by", as: "CreatedInvestments" });
Investment.belongsTo(User, { foreignKey: "created_by", as: "CreatedBy" });

module.exports = Investment;