const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 26-09-2025
 */

const Project = sequelize.define("Project", {
  project_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sub_department: {
    type: DataTypes.STRING,
    allowNull: true
  },
  product: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estimated_budget: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM("planned", "ongoing", "completed", "on-hold"),
    defaultValue: "planned"
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "projects",
  timestamps: true,       // adds createdAt, updatedAt
  paranoid: true          // adds deletedAt (soft delete)
});

module.exports = Project;
