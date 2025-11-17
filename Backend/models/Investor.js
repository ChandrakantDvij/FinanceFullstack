const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

/**
 * @author Vaishnavi Jambhale
 * @version 2.0
 * @since 08-10-2025
 */

const Investor = sequelize.define(
  "Investor",
  {
    investor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "investors",
    timestamps: true,
    paranoid: true,
  }
);

// Relations
Investor.belongsTo(User, { foreignKey: "created_by", as: "creator" });

module.exports = Investor;