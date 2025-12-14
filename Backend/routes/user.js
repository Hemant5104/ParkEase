const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

// Protected route to fetch the authenticated user's profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected route to fetch authenticated user's vehicle details
router.get("/vehicle", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "vehicleNumber vehicleType phone name email role"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      vehicle: {
        vehicleNumber: user.vehicleNumber,
        vehicleType: user.vehicleType,
      },
      contact: { phone: user.phone },
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

