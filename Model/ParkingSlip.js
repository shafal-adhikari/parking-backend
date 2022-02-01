const mongoose = require("mongoose");

const parkingSlipSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.ObjectId,
      ref: "booking",
    },
    actualEntryTime: Date,
    actualExitTime: Date,
    cost: {
      type: Number,
      required: [true, "cost is required"],
    },
    penalty: {
      type: Number,
      default: 0,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

parkingSlipSchema.virtual("totalCost", function () {
  return this.cost + this.penalty;
});

const ParkingSlip = mongoose.model("parkingSlip", parkingSlipSchema);
module.exports = ParkingSlip;
