const User = require("../models/User");

const bcrypt = require("bcryptjs");
const Department = require("../models/Department");

const getUsers = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    let filter = {};

    if (req.user.role === "manager") {
      filter.department = req.user.department;
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .populate("department", "name")
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit),

      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: {
        users,
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

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("department", "name");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    // Employees can only view their own profile
    if (
      req.user.role === "employee" &&
      req.user._id.toString() !== user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this user",
        data: null,
      });
    }

    // Managers can only view users in their department
    if (req.user.role === "manager") {
      if (
        !user.department ||
        user.department._id.toString() !== req.user.department.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to view this user",
          data: null,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = "employee",
      position,
      department,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists",
        data: null,
      });
    }

    const existingDepartment = await Department.findById(department);

    if (!existingDepartment) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
        data: null,
      });
    }

    if (!existingDepartment.isActive) {
      return res.status(400).json({
        success: false,
        message: "Cannot assign user to an inactive department",
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      position,
      department,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        position: user.position,
        department: user.department,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    const {
      name,
      email,
      role,
      position,
      department,
      isActive,
    } = req.body;

    // Employees can only update their own name and position
    if (req.user.role === "employee") {
      if (req.user._id.toString() !== user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update this user",
          data: null,
        });
      }

      const allowedFields = ["name", "position"];
      const submittedFields = Object.keys(req.body);

      const hasUnauthorizedField = submittedFields.some(
        (field) => !allowedFields.includes(field)
      );

      if (hasUnauthorizedField) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update these fields",
          data: null,
        });
      }
    }

    // Managers can only update users in their own department
if (req.user.role === "manager") {
  if (
    !user.department ||
    user.department.toString() !== req.user.department.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to update this user",
      data: null,
    });
  }

  if (role === "admin") {
    return res.status(403).json({
      success: false,
      message: "Managers cannot assign the admin role",
      data: null,
    });
  }

  if (
    department !== undefined &&
    department !== user.department.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: "Managers cannot change a user's department",
      data: null,
    });
  }
}

    // Check email uniqueness
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "A user with this email already exists",
          data: null,
        });
      }
    }

    // Validate department if it is being changed
    if (department && department !== user.department?.toString()) {
      const existingDepartment = await Department.findById(department);

      if (!existingDepartment) {
        return res.status(404).json({
          success: false,
          message: "Department not found",
          data: null,
        });
      }

      if (!existingDepartment.isActive) {
        return res.status(400).json({
          success: false,
          message: "Cannot assign user to an inactive department",
          data: null,
        });
      }
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;
    if (position !== undefined) user.position = position;
    if (department !== undefined) user.department = department;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        position: user.position,
        department: user.department,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    // Employees cannot deactivate users
    if (req.user.role === "employee") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to deactivate users",
        data: null,
      });
    }

    // Managers can only deactivate users in their own department
    if (req.user.role === "manager") {
      if (
        !user.department ||
        user.department.toString() !== req.user.department.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to deactivate this user",
          data: null,
        });
      }
    }

    // Prevent deactivating an already inactive user
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: "User is already inactive",
        data: null,
      });
    }

    user.isActive = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User deactivated successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};