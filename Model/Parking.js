const mongoose = require("mongoose");
const slugify = require("slugify");

const parkingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      max: 255,
      required: [true, "Parking name is required."],
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    ratingQuantity: {
      type: Number,
      default: 4.5,
      min: [1, "A parking should have rating more than 1"],
      max: [5, "A parking should have rating less than 5"],
    },
    ratingAverage: {
      type: Number,
    },
    location: {
      type: String,
      required: [true, "location is required."],
    },
    geometry: {
      type: {
        type: String,
        enum: ["point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: [true, "coordinates of parking location is required."],
      },
    },

    staffs: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "user",
      },
    ],
    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

parkingSchema.index({ geometry: "2dsphere" });

parkingSchema.virtual("floors", {
  ref: "floor",
  foreignField: "parking",
  localField: "_id",
});
parkingSchema.pre("save", function () {
  this.slug = slugify(this.name, { lower: true });
});

const Parking = mongoose.model("parking", parkingSchema);
module.exports = Parking;
