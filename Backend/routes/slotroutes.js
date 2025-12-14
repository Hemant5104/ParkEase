const express = require("express");

const router = express.Router();

// Use the defined Slot model; filename is `Slot.js` (not slotModel).
const Slot = require("../models/Slot");

router.get("/all", async (req, res) => {

    try {

        const slots = await Slot.find();

        res.json({ slots });

    } catch (err) {

        res.status(500).json({ message: "Error fetching slots" });

    }

});
 
module.exports = router;
 