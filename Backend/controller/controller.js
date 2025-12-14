const Event = require("../models/Event");

// GET /api/events/advanced-events
exports.getAdvancedEvents = async (req, res) => {
    try {
      let { page, limit, search, sort } = req.query;
   
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 5;
   
      const skip = (page - 1) * limit;
   
      let query = {};
   
      // Search by event name
      if (search) {
        query.eventName = { $regex: search, $options: "i" };
      }
   
      // Sorting logic
      let sortOption = {};
      if (sort === "asc") {
        sortOption.createdAt = 1; // Oldest first
      } else {
        sortOption.createdAt = -1; // Newest first
      }
   
      // Fetch events
      const events = await Event.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit);
   
      const total = await Event.countDocuments(query);
   
      res.json({
        success: true,
        total,
        page,
        pages: Math.ceil(total / limit),
        events,
      });
   
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// GET /api/events/all
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/events/create
exports.createEvent = async (req, res) => {
  try {
    const { eventName, description, date } = req.body;
    
    if (!eventName) {
      return res.status(400).json({ message: "eventName is required" });
    }

    const event = new Event({
      eventName,
      description: description || "",
      date: date || new Date(),
    });

    await event.save();
    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/events/update/:id
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { eventName, description, date } = req.body;

    const event = await Event.findByIdAndUpdate(
      id,
      { eventName, description, date },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/events/delete/:id
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};