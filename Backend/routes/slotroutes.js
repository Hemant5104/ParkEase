const express = require("express");
const router = express.Router();

// Use the defined Slot model; filename is `Slot.js` (not slotModel).
const Slot = require("../models/Slot");
const authMiddleware = require("../middleware/authMiddleware");

// Helper: normalize a slot to a consistent shape
const normalizeSlot = (s) => {
    const status = s.status
        ? s.status
        : s.isAvailable === false
        ? "occupied"
        : "available";
    return {
        _id: s._id,
        slotNumber: s.slotNumber,
        status,
        description: s.description || "",
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
    };
};

// GET /api/slots/all - list all slots (normalized)
router.get("/all", async (req, res) => {
    try {
        const slots = await Slot.find();
        const normalized = slots.map(normalizeSlot);
        res.json({ slots: normalized });
    } catch (err) {
        res.status(500).json({ message: "Error fetching slots" });
    }
});

// GET /api/slots/summary - totals and availability counts
router.get("/summary", async (req, res) => {
    try {
        const slots = await Slot.find();
        const normalized = slots.map(normalizeSlot);
        const total = normalized.length;
        const available = normalized.filter((s) => s.status === "available").length;
        const occupied = normalized.filter((s) => s.status !== "available").length;
        res.json({ total, available, occupied });
    } catch (err) {
        res.status(500).json({ message: "Error computing summary" });
    }
});

// POST /api/slots/book/:id - book a slot (requires auth)
router.post("/book/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const slot = await Slot.findById(id);
        if (!slot) return res.status(404).json({ message: "Slot not found" });

        const status = slot.status
            ? slot.status
            : slot.isAvailable === false
            ? "occupied"
            : "available";

        if (status !== "available") {
            return res.status(400).json({ message: "Slot is not available" });
        }

        // Update both representations to be safe across schemas
        await Slot.updateOne(
            { _id: id },
            { $set: { status: "occupied", isAvailable: false } }
        );

        res.json({ message: "Slot booked successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error booking slot" });
    }
});

// POST /api/slots/release/:id - release a slot (requires auth)
router.post("/release/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const slot = await Slot.findById(id);
        if (!slot) return res.status(404).json({ message: "Slot not found" });

        await Slot.updateOne(
            { _id: id },
            { $set: { status: "available", isAvailable: true } }
        );

        res.json({ message: "Slot released successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error releasing slot" });
    }
});

module.exports = router;
 