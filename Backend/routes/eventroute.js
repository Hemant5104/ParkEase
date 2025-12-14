const express = require("express");
const router = express.Router();
const {
  getAdvancedEvents,
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} = require("../controller/controller");

router.get("/advanced-events", getAdvancedEvents);
router.post("/create", createEvent);
router.get("/all", getEvents);
router.put("/update/:id", updateEvent);
router.delete("/delete/:id", deleteEvent);

module.exports = router;