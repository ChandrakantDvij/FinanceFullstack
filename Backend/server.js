const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const sequelize = require("../Backend/config/db");
const authRoutes = require("../Backend/routes/authRoutes");
const userRoutes = require("../Backend/routes/userRoutes");
const projectRoutes = require("../Backend/routes/projectRoutes");
const employeeRoutes = require("../Backend/routes/employeeRoutes");
const expenseRoutes = require("../Backend/routes/expenseRoutes");
const investorRoutes = require("../Backend/routes/investorRoutes");
const projectAssignmentRoutes = require("../Backend/routes/projectAssignmentRoutes");
const expenseReviewRoutes = require("../Backend/routes/expenseReviewRoutes"); 
const dashboardRoutes = require("../Backend/routes/dashboardRoutes");
const assignInvestorRoutes = require("../Backend/routes/assignInvestorRoutes");
const investmentRoutes = require("../Backend/routes/investmentRoutes");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
// CORS: allow frontend at http://localhost:8080
/*app.use(cors({
 // origin: process.env.FRONTEND_ORIGIN || 'http://192.168.29.224:3000',
  origin: '*',  // Allow all origins for testing purposes
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: false,
}));
*/
/** 
 * @auther Vaishnavi Jambhale
 * @version 1.0
 * @since 26-09-2025
 */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/investors", investorRoutes);
app.use("/api/project-assignments", projectAssignmentRoutes);
app.use("/api/expense-reviews", expenseReviewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/assign-investors", assignInvestorRoutes);
app.use("/api/investments", require("../Backend/routes/investmentRoutes"));

// ---- HEALTH CHECK ENDPOINT FOR JENKINS ----
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Backend OK" });
});

sequelize.sync({ force: false })
  .then(() => console.log("Database connected"))
  .catch(err => console.error("DB Error:", err));

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
                                                                           
