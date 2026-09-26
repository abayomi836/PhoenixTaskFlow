const express = require("express");

const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

const {
  createTaskValidator,
  updateTaskValidator,
  updateTaskStatusValidator,
} = require("../validators/taskValidator");

const validate = require("../middleware/validateMiddleware");

const router = express.Router();

// Get all tasks
router.get("/", protect, getTasks);

// Get a single task
router.get("/:id", protect, getTaskById);

// Create a task
router.post(
  "/",
  protect,
  createTaskValidator,
  validate,
  createTask
);

// Update task details
router.patch(
  "/:id",
  protect,
  updateTaskValidator,
  validate,
  updateTask
);

// Update task status
router.patch(
  "/:id/status",
  protect,
  updateTaskStatusValidator,
  validate,
  updateTaskStatus
);

// Delete a task
router.delete("/:id", protect, deleteTask);

module.exports = router;