const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Project = require("./Project");
const Investor = require("./Investor");
const User = require("./User");

/** 
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 15-11-2025
 */

const AssignInvestor = sequelize.define(
  "AssignInvestor",
  {
    assign_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Project,
        key: "project_id",
      },
    },

    investor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Investor,
        key: "investor_id",
      },
    },

    assigned_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "assign_investors",
    timestamps: true,
    paranoid: true,
  }
);

AssignInvestor.belongsTo(Project, {foreignKey: "project_id",as: "project",onDelete: "CASCADE",});
AssignInvestor.belongsTo(Investor, {foreignKey: "investor_id",as: "investor",onDelete: "CASCADE",});
AssignInvestor.belongsTo(User, {foreignKey: "assigned_by",as: "assignedBy",onDelete: "CASCADE",});

module.exports = AssignInvestor;
