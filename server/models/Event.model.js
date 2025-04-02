const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: {
      type: String,
      required: function () {
        return this.eventType === "in-person";
      },
    },
    meetingLink: {
      type: String,
      required: function () {
        return this.eventType === "online";
      },
      validate: {
        validator: function (v) {
          // Simple URL validation
          return (
            this.eventType !== "online" ||
            /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
              v
            )
          );
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    eventType: {
      type: String,
      required: true,
      enum: ["in-person", "online"],
      default: "in-person",
    },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    availableTickets: { type: Number, required: true, default: 0 },
    coverImage: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
