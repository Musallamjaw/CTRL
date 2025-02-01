const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  availableTickets: { type: Number, required: true },
  coverImage: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
