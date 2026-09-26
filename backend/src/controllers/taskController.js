const Task = require("../models/Task");
const User = require("../models/User");
const Department = require("../models/Department");

// Get tasks
const getTasks = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};

    // Employees can only see tasks assigned to them
    if (req.user.role === "employee") {
      filter.assignedTo = req.user._id;
    }

    // Managers can only see tasks in their department
    if (req.user.role === "manager") {
      filter.department = req.user.department;
    }

    // Optional filters
    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    if (req.query.department && req.user.role === "admin") {
  filter.department = req.query.department;
}

if (req.query.assignedTo && req.user.role === "admin") {
  filter.assignedTo = req.query.assignedTo;
}

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate("assignedTo", "name email position")
        .populate("assignedBy", "name email position")
        .populate("department", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Task.countDocuments(filter),
    ]);

    const tasksWithOverdue = tasks.map((task) => {
      const taskObject = task.toObject();

      taskObject.overdue =
        task.dueDate < new Date() && task.status !== "completed";

      return taskObject;
    });

    return res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      data: {
        tasks: tasksWithOverdue,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a single task
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email position department")
      .populate("assignedBy", "name email position")
      .populate("department", "name");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
        data: null,
      });
    }

    // Employees can only view their own assigned tasks
    if (
      req.user.role === "employee" &&
      task.assignedTo._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this task",
        data: null,
      });
    }

    // Managers can only view tasks in their department
    if (
      req.user.role === "manager" &&
      task.department._id.toString() !== req.user.department.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this task",
        data: null,
      });
    }

    const taskData = task.toObject();

    taskData.overdue =
      task.dueDate < new Date() && task.status !== "completed";

    return res.status(200).json({
      success: true,
      message: "Task retrieved successfully",
      data: taskData,
    });
  } catch (error) {
    next(error);
  }
};

// Create a task
const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      assignedTo,
      priority,
      dueDate,
    } = req.body;

    // Find the employee receiving the task
    const assignedUser = await User.findById(assignedTo);

    if (!assignedUser) {
      return res.status(404).json({
        success: false,
        message: "Assigned user not found",
        data: null,
      });
    }

    if (!assignedUser.isActive) {
      return res.status(400).json({
        success: false,
        message: "Cannot assign a task to an inactive user",
        data: null,
      });
    }

    // Only employees can receive tasks
if (assignedUser.role !== "employee") {
  return res.status(400).json({
    success: false,
    message: "Tasks can only be assigned to employees",
    data: null,
  });
}

if (!assignedUser.department) {
  return res.status(400).json({
    success: false,
    message: "Assigned user must belong to a department",
    data: null,
  });
}

// Managers can only assign tasks within their department
if (
  req.user.role === "manager" &&
  (!req.user.department ||
    assignedUser.department.toString() !== req.user.department.toString())
) {
  return res.status(403).json({
    success: false,
    message: "Managers can only assign tasks within their department",
    data: null,
  });
}

    // Get the department from the assigned employee
    const department = await Department.findById(assignedUser.department);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Assigned user's department not found",
        data: null,
      });
    }

    if (!department.isActive) {
      return res.status(400).json({
        success: false,
        message: "Cannot assign a task to an inactive department",
        data: null,
      });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo: assignedUser._id,
      assignedBy: req.user._id,
      department: assignedUser.department,
      priority,
      dueDate,
      status: "pending",
      completedAt: null,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email position")
      .populate("assignedBy", "name email position")
      .populate("department", "name");

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// Update task details
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
        data: null,
      });
    }

    // Employees cannot edit task details
    if (req.user.role === "employee") {
      return res.status(403).json({
        success: false,
        message: "Employees cannot edit task details",
        data: null,
      });
    }

    // Managers can only edit tasks in their department
    if (
      req.user.role === "manager" &&
      task.department.toString() !== req.user.department.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this task",
        data: null,
      });
    }

    const {
      title,
      description,
      assignedTo,
      priority,
      dueDate,
    } = req.body;

    // Validate a new assignee if one is provided
    if (
      assignedTo !== undefined &&
      assignedTo.toString() !== task.assignedTo.toString()
    ) {
      const assignedUser = await User.findById(assignedTo);

      if (!assignedUser) {
        return res.status(404).json({
          success: false,
          message: "Assigned user not found",
          data: null,
        });
      }

      if (!assignedUser.isActive) {
        return res.status(400).json({
          success: false,
          message: "Cannot assign a task to an inactive user",
          data: null,
        });
      }

      if (assignedUser.role !== "employee") {
        return res.status(400).json({
          success: false,
          message: "Tasks can only be assigned to employees",
          data: null,
        });
      }

      if (!assignedUser.department) {
  return res.status(400).json({
    success: false,
    message: "Assigned user must belong to a department",
    data: null,
  });
}

// Managers cannot reassign outside their department
if (
  req.user.role === "manager" &&
  (!req.user.department ||
    assignedUser.department.toString() !== req.user.department.toString())
) {
        return res.status(403).json({
          success: false,
          message: "Managers can only assign tasks within their department",
          data: null,
        });
      }

      const assignedDepartment = await Department.findById(
        assignedUser.department
      );

      if (!assignedDepartment) {
        return res.status(404).json({
          success: false,
          message: "Assigned user's department not found",
          data: null,
        });
      }

      if (!assignedDepartment.isActive) {
        return res.status(400).json({
          success: false,
          message: "Cannot assign a task to an inactive department",
          data: null,
        });
      }

      task.assignedTo = assignedUser._id;
      task.department = assignedUser.department;
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email position")
      .populate("assignedBy", "name email position")
      .populate("department", "name");

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// Update task status
const updateTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
        data: null,
      });
    }

    // Employees can only update the status of their own tasks
    if (req.user.role === "employee") {
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update this task",
          data: null,
        });
      }
    }

    // Managers can only update tasks in their department
    if (
      req.user.role === "manager" &&
      task.department.toString() !== req.user.department.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this task",
        data: null,
      });
    }

    const { status } = req.body;

    task.status = status;

    // Automatically manage completedAt
    if (status === "completed") {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email position")
      .populate("assignedBy", "name email position")
      .populate("department", "name");

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a task
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
        data: null,
      });
    }

    // Employees cannot delete tasks
    if (req.user.role === "employee") {
      return res.status(403).json({
        success: false,
        message: "Employees cannot delete tasks",
        data: null,
      });
    }

    // Managers can only delete tasks in their department
    if (
      req.user.role === "manager" &&
      task.department.toString() !== req.user.department.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this task",
        data: null,
      });
    }

    await task.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};