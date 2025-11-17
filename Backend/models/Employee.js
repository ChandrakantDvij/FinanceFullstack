const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User"); // for created_by relation

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 16-10-2025
 */

const Employee = sequelize.define("Employee", {
  employee_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    set(value) {
      this.setDataValue("email", value.toLowerCase());
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { is: /^[0-9]{10}$/ }
  },
  role: {
    type: DataTypes.ENUM("employee"),
    allowNull: false,
    defaultValue: "employee"
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id"
    }
  }
}, {
  tableName: "employees",
  timestamps: true,
  paranoid: true 
});

Employee.belongsTo(User, { foreignKey: "created_by", as: "creator" });

module.exports = Employee;
