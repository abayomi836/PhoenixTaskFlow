require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");
const Department = require("./models/Department");

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@phoenixtaskflow.com";
    const adminPassword = "Admin@12345";

    let department = await Department.findOne({
      name: "Administration",
    });

    if (!department) {
      department = await Department.create({
        name: "Administration",
        description: "Administrative department for PhoenixTASKFLOW.",
      });

      console.log("Administration department created.");
    }

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    await User.create({
      name: "PhoenixTASKFLOW Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      position: "Administrator",
      department: department._id,
      isActive: true,
    });

    console.log("Admin account created successfully.");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
  } catch (error) {
    console.error("Admin seed failed:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

seedAdmin();