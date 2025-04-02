const Event = require("../models/Event.model");
const { uploadUserCoverImage } = require("../middleware/multerConfig");

// Helper function to validate event data
const validateEventData = (eventType, data) => {
  if (
    !data.title ||
    !data.description ||
    !data.date ||
    !data.price ||
    !data.capacity
  ) {
    return { valid: false, message: "All required fields must be filled" };
  }

  if (eventType === "in-person" && !data.location) {
    return {
      valid: false,
      message: "Location is required for in-person events",
    };
  }

  if (eventType === "online" && !data.meetingLink) {
    return {
      valid: false,
      message: "Meeting link is required for online events",
    };
  }

  if (eventType === "online" && data.meetingLink) {
    try {
      new URL(data.meetingLink);
    } catch (err) {
      return { valid: false, message: "Meeting link must be a valid URL" };
    }
  }

  return { valid: true };
};

// Create a new event
exports.createEvent = async (req, res) => {
  uploadUserCoverImage(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    try {
      const {
        title,
        description,
        date,
        location,
        meetingLink,
        price,
        capacity,
        eventType,
      } = req.body;

      // Validate input data
      const validation = validateEventData(eventType, req.body);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.message,
        });
      }

      // Create new event
      const newEvent = new Event({
        title,
        description,
        date: new Date(date),
        location: eventType === "in-person" ? location : "Online Event",
        meetingLink: eventType === "online" ? meetingLink : undefined,
        eventType,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        availableTickets: parseInt(capacity),
        coverImage: req.file ? req.file.filename : "default-event.jpg",
      });

      // Save to database
      const savedEvent = await newEvent.save();

      return res.status(201).json({
        success: true,
        message: "Event created successfully",
        data: savedEvent,
      });
    } catch (error) {
      console.error("Error creating event:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create event",
        error: error.message,
      });
    }
  });
};

// Get all events with pagination and filtering
exports.getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 4;
    const skip = (page - 1) * limit;
    const filter = req.params.filter || "all";

    let query = {};
    if (filter === "open") {
      query.availableTickets = { $gt: 0 };
    } else if (filter === "closed") {
      query.availableTickets = 0;
    }

    const events = await Event.find(query)
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);

    const totalEvents = await Event.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: events,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalEvents / limit),
        totalEvents,
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch event",
      error: error.message,
    });
  }
};

// Update event by ID
exports.updateEventById = async (req, res) => {
  uploadUserCoverImage(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    try {
      const {
        title,
        description,
        date,
        location,
        meetingLink,
        price,
        capacity,
        availableTickets,
        eventType = "in-person",
      } = req.body;

      // Validate input data
      const validation = validateEventData(eventType, req.body);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.message,
        });
      }

      const updateData = {
        title,
        description,
        date: new Date(date),
        location: eventType === "in-person" ? location : "Online Event",
        meetingLink: eventType === "online" ? meetingLink : undefined,
        eventType,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        availableTickets: parseInt(availableTickets),
      };

      if (req.file) {
        updateData.coverImage = req.file.filename;
      }

      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedEvent) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Event updated successfully",
        data: updatedEvent,
      });
    } catch (error) {
      console.error("Error updating event:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update event",
        error: error.message,
      });
    }
  });
};

// Delete event by ID
exports.deleteEventById = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  }
};

// Get closest upcoming event
exports.getClosestEvent = async (req, res) => {
  try {
    const now = new Date();
    const closestEvent = await Event.findOne({ date: { $gt: now } }).sort({
      date: 1,
    });

    if (!closestEvent) {
      return res.status(404).json({
        success: false,
        message: "No upcoming events found",
      });
    }

    return res.status(200).json({
      success: true,
      data: closestEvent,
    });
  } catch (error) {
    console.error("Error fetching closest event:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch closest event",
      error: error.message,
    });
  }
};

// Get events count by filter
exports.getCountEvents = async (req, res) => {
  try {
    const filter = req.params.filter;
    let query = {};

    if (filter === "open") {
      query.availableTickets = { $gt: 0 };
    } else if (filter === "closed") {
      query.availableTickets = 0;
    }

    const count = await Event.countDocuments(query);

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error counting events:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to count events",
      error: error.message,
    });
  }
};

// Get events for scanner (recent and upcoming)
exports.getAllEventsForScanner = async (req, res) => {
  try {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const events = await Event.find({ date: { $gte: yesterday } })
      .sort({ date: 1 })
      .select("_id title date eventType");

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("Error fetching events for scanner:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch events for scanner",
      error: error.message,
    });
  }
};
