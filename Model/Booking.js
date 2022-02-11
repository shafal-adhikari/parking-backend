const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    contact: {
      type: String,
    },
    parking: {
      name: String,
      location: String,
      id: String,
      floor: {
        id: String,
        name: String,
      },
      slot: {
        id: String,
        name: String,
      },
    },
    vehicleType: {
      type: String,
      trim: true,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookingSchema.virtual("duration", function () {
  return this.endTime - this.startTime;
});
const Booking = mongoose.model("booking", bookingSchema);
module.exports = Booking;
