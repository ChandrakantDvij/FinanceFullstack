const { Sequelize } = require("sequelize");
require("dotenv").config();

/**
 * @author Vaishnavi Jambhale
 * @version 1.0
 * @since 26-09-2025
 */
const sequelize = new Sequelize(
  process.env.DB_NAME || "finance",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "12345",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    logging: false,
    define: { freezeTableName: true },
    dialectOptions: { charset: 'utf8mb4' }
  }
);

// Test connection and synchronize models
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to MySQL Database");

    // Sync models (auto-updates schema without dropping data)
    await sequelize.sync({ alter: true });
    console.log("✅ All models were synchronized successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
})();
module.exports = sequelize;