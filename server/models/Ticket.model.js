const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  qrID: { type: String, required: true, unique: true },
  eventData: {
    eventId: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
  },
  userData: {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  qrCode: { type: String, required: true },
  status: { type: String, default: 'unused' },
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);
