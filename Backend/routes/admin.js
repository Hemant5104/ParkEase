const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/admin");
const Slot = require("../models/Slot");
const jwt = require("jsonwebtoken");

router.get("/dashboard", auth, admin, (req, res) => {
  res.json({ message: "Welcome Admin! You have full access." });
});

// Add a new parking slot (admin only)
router.post("/add-slot", auth, admin, async (req, res) => {
  try {
    const { slotNumber, status = "available", description = "" } = req.body;

    if (!slotNumber) {
      return res.status(400).json({ message: "slotNumber is required" });
    }

    const existing = await Slot.findOne({ slotNumber });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Slot with this slotNumber already exists" });
    }

    const slot = await Slot.create({ slotNumber, status, description });
    res.status(201).json({ message: "Slot added successfully", slot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// const token = jwt.sign(
//   {
//       id: user._id,
//       email: user.email,
//       role: user.role       // <-- VERY IMPORTANT
//   },
//   "secretKey123",
//   { expiresIn: "1h" }
// );

module.exports = router;
