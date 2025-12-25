const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Slot = require("../models/Slot");
const Booking = require("../models/Booking");

// POST /api/bookings/create - create a booking and mark slot occupied
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { slotId, durationMinutes } = req.body;
    if (!slotId || !durationMinutes) {
      return res.status(400).json({ message: "slotId and durationMinutes are required" });
    }

    const slot = await Slot.findById(slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    const currentStatus = slot.status ? slot.status : slot.isAvailable === false ? "occupied" : "available";
    if (currentStatus !== "available") {
      return res.status(400).json({ message: "Slot is not available" });
    }

    const now = new Date();
    const end = new Date(now.getTime() + Number(durationMinutes) * 60000);

    // Create booking first
    const booking = await Booking.create({
      user: req.user.id,
      slot: slotId,
      status: "active",
      startTime: now,
      endTime: end,
    });

    // Mark slot occupied
    await Slot.updateOne({ _id: slotId }, { $set: { status: "occupied", isAvailable: false, updatedAt: new Date() } });

    res.json({ message: "Booking created", booking });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error creating booking" });
  }
});

// GET /api/bookings/my - list current user's bookings
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 }).populate("slot");
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error fetching bookings" });
  }
});

module.exports = router;
