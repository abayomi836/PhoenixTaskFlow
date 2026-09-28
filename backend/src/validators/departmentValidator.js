const { body } = require("express-validator");

const createDepartmentValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Department name is required"),

  body("description")
    .optional()
    .trim(),
];

const updateDepartmentValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Department name cannot be empty"),

  body("description")
    .optional()
    .trim(),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

module.exports = {
  createDepartmentValidator,
  updateDepartmentValidator,
};