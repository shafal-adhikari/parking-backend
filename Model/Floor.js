const mongoose = require("mongoose");

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
  },
  {
    toJSON: { virtuals: true },
  }
);

floorSchema.virtual("slots", {
  ref: "slot",
  foreignField: "floor",
  localField: "_id",
});
const Floor = mongoose.model("floor", floorSchema);
module.exports = Floor;
