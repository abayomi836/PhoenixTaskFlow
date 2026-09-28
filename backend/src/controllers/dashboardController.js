const Task = require("../models/Task");
const User = require("../models/User");
const Department = require("../models/Department");

const getDashboardStats = async (req, res, next) => {
  try {
    let taskFilter = {};

    // Employees only see statistics for their assigned tasks
    if (req.user.role === "employee") {
      taskFilter.assignedTo = req.user._id;
    }

    // Managers only see statistics for their department
    if (req.user.role === "manager") {
      taskFilter.department = req.user.department;
    }

    const now = new Date();

    const taskStats = await Task.aggregate([
      {
        $match: taskFilter,
      },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },

          pending: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
            },
          },

          inProgress: {
            $sum: {
              $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0],
            },
          },

          completed: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },

          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ["$dueDate", now] },
                    { $ne: ["$status", "completed"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const taskData = taskStats[0] || {
      totalTasks: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0,
    };

    let employeeCount = null;
    let departmentCount = null;

    // Admin gets organization-wide employee and department counts
    if (req.user.role === "admin") {
      [employeeCount, departmentCount] = await Promise.all([
        User.countDocuments({
          role: "employee",
          isActive: true,
        }),

        Department.countDocuments({
          isActive: true,
        }),
      ]);
    }

    // Manager gets active employee count in their department
    if (req.user.role === "manager") {
      employeeCount = await User.countDocuments({
        department: req.user.department,
        role: "employee",
        isActive: true,
      });
    }

    const data = {
      totalTasks: taskData.totalTasks,
      pending: taskData.pending,
      inProgress: taskData.inProgress,
      completed: taskData.completed,
      overdue: taskData.overdue,
    };

    if (req.user.role === "admin") {
      data.totalEmployees = employeeCount;
      data.totalDepartments = departmentCount;
    }

    if (req.user.role === "manager") {
      data.totalEmployees = employeeCount;
    }

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics retrieved successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};