const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 26-09-2025
 */

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { is: /^[0-9]{10}$/ }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [6, 100] }
  },
  role: {
    type: DataTypes.ENUM("superadmin", "reviewer", "accountant"),
    defaultValue: null
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  paranoid: true
});

module.exports = User;
