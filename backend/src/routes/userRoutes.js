const express = require("express");

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createUserValidator,
  updateUserValidator,
} = require("../validators/userValidator");

const validate = require("../middleware/validateMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("admin", "manager"),
  getUsers
);

router.get(
  "/:id",
  protect,
  getUserById
);

router.post(
  "/",
  protect,
  authorize("admin"),
  createUserValidator,
  validate,
  createUser
);

router.patch(
  "/:id",
  protect,
  updateUserValidator,
  validate,
  updateUser
);

router.delete(
  "/:id",
  protect,
  deleteUser
);

module.exports = router;