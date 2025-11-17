const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Project = require("./Project");
const Employee = require("./Employee");
const User = require("./User");

/**
 * @author Vaishnavi Jambhale
 * @version 1.1
 * @since 29-10-2025
 */

const ProjectAssignment = sequelize.define(
  "ProjectAssignment",
  {
    assignment_id: {
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
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Employee,
        key: "employee_id",
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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "project_assignments",
    timestamps: true,
    paranoid: true,
  }
);

// Associations
ProjectAssignment.belongsTo(Project, { foreignKey: "project_id", as: "project" });
ProjectAssignment.belongsTo(Employee, { foreignKey: "employee_id", as: "employee" });
ProjectAssignment.belongsTo(User, { foreignKey: "assigned_by", as: "assigner" });

module.exports = ProjectAssignment;
