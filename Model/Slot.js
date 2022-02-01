const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  slot: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "slot number is required"],
  },
  carPrice: {
    type: Number,
    required: [true, "carprice of slot is required"],
  },
  bikePrice: {
    type: Number,
    required: [true, "bikeprice of slot is required"],
  },
  floor: {
    type: mongoose.Schema.ObjectId,
    ref: "floor",
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

const Slot = mongoose.model("slot", slotSchema);
module.exports = Slot;
