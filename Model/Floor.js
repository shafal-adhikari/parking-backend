const mongoose = require("mongoose");
const slotSchema = require("./Slot");
const floorSchema = new mongoose.Schema(
  {
    floor: {
      type: Number,
      unique: true,
      requierd: [true, "floor name is required"],
    },
    parking: {
      type: mongoose.Schema.ObjectId,
      ref: "parking",
    },
    carSlot: {
      type: Number,
      max: 100,
    },
    bikeSlot: {
      type: Number,
      max: 100,
    },
    isCovered: {
      type: Boolean,
      default: false,
    },
    isAccessible: {
      type: Boolean,
      default: true,
    },
    slots: [slotSchema],
  },
  {
    toJSON: { virtuals: true },
  }
);
module.exports = floorSchema;
