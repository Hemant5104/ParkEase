const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

// Configuration: update these values if you want a different admin account
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "Admin@123";

async function run() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not set in the environment.");
    }

    console.log("Connecting to Mongo...");
    await mongoose.connect(process.env.MONGO_URI);

    // Hash the password once per run
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log("User already exists, promoting to admin...");
      await User.updateOne({ email: ADMIN_EMAIL }, { $set: { role: "admin" } });
    } else {
      console.log("Creating new admin user...");
      await User.create({
        name: "Admin",
        email: ADMIN_EMAIL,
        password: hashed,
        vehicleNumber: "ADMIN-001",
        vehicleType: "N/A",
        phone: "0000000000",
        role: "admin",
      });
    }

    console.log("Done.");
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();


