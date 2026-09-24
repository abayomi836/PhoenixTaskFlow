const express = require("express");

const {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createDepartmentValidator,
  updateDepartmentValidator,
} = require("../validators/departmentValidator");

const validate = require("../middleware/validateMiddleware");

const router = express.Router();

router.get("/", protect, getDepartments);

router.get("/:id", protect, getDepartmentById);

router.post(
  "/",
  protect,
  authorize("admin"),
  createDepartmentValidator,
  validate,
  createDepartment
);

router.patch(
  "/:id",
  protect,
  authorize("admin"),
  updateDepartmentValidator,
  validate,
  updateDepartment
);

router.delete("/:id", protect, authorize("admin"), deleteDepartment);

module.exports = router;