const { body } = require("express-validator");

const createUserValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  body("role")
    .optional()
    .isIn(["admin", "manager", "employee"])
    .withMessage("Invalid role"),

  body("position")
    .trim()
    .notEmpty()
    .withMessage("Position is required"),

  body("department")
    .notEmpty()
    .withMessage("Department is required"),
];

const updateUserValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("role")
    .optional()
    .isIn(["admin", "manager", "employee"])
    .withMessage("Invalid role"),

  body("position")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Position cannot be empty"),

  body("department")
    .optional()
    .notEmpty()
    .withMessage("Department is required"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

module.exports = {
  createUserValidator,
  updateUserValidator,
};

module.exports = {
  createUserValidator,
  updateUserValidator,
};