const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Centralized token generator to keep JWT payload/secret consistent.
const createAuthToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role, // role is important for downstream authorization
    },
    "secretKey123",
    { expiresIn: "1h" }
  );

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, vehicleNumber, vehicleType, phone } =
      req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      vehicleNumber,
      vehicleType,
      phone,
    });

    await user.save();

    res.json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    // Create JWT token
    const token = createAuthToken(user);

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const authMiddleware = require("../middleware/authMiddleware");

router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to your dashboard!", user: req.user });
});

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); //fetches user but remove password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
