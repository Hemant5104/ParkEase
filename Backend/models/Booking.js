const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    slot: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", required: true },
    status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
