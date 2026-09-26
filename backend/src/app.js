const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PhoenixTASKFLOW API is running",
    data: null,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use(errorHandler);

module.exports = app;
