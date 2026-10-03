const express = require("express");

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const {
  registerValidator,
  loginValidator,
   forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/authValidator");

const validate = require("../middleware/validateMiddleware");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerValidator, validate, register);

router.post("/login", loginValidator, validate, login);

router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validate,
  forgotPassword
);

router.post(
  "/reset-password/:token",
  resetPasswordValidator,
  validate,
  resetPassword
);

router.get("/me", protect, getMe);

module.exports = router;