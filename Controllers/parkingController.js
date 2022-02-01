const { catchAsync } = require("../utils/catchAsync");
const parkingModel = require("../Model/Parking");
const AppError = require("../utils/appError");
exports.getParkings = catchAsync(async (req, res) => {
  const parkings = await parkingModel.find();
  res.status(200).json({
    status: "success",
    results: parkings.length,
    data: parkings,
  });
});

exports.addParking = catchAsync(async (req, res) => {
  const { name, location, description, coordinates } = req.body;
  const newParking = new parkingModel({
    name,
    location,
    description,
    coordinates,
    image: {
      data: req.file.buffer,
      contentType: "image/jpg",
    },
  });
  await newParking.save();
  await res.status(200).json({ status: "success", data: newParking });
});

exports.getParking = catchAsync(async (req, res, next) => {
  const parking = await parkingModel
    .findById(req.params.id)
    .populate({ path: "floors", populate: { path: "slots" } })
    .select("-image");
  if (!parking) {
    return next(new AppError("Invalid ID! Parking not found.", 400));
  }
  res.status(200).json({
    status: "success",
    data: parking,
  });
});

exports.updateParking = catchAsync(async (req, res) => {
  const updatedParking = await parkingModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: false, runValidators: true }
  );
  res.status(200).json({
    status: "success",
    data: updatedParking,
  });
});

exports.deleteParking = catchAsync(async (req, res) => {
  await parkingModel.findByIdAndRemove(req.params.id);
  res.status(204).json({
    status: "success",
  });
});
exports.getParkingWithinDistance = catchAsync(async (req, res) => {
  const parkings = await parkingModel
    .find({
      geometry: {
        $geoWithin: { $centerSphere: [[85.330131, 27.706267], 2 / 3963.2] },
      },
    })
    .select("name description location");
  /* const parking = await parkingModel.findOne({
    geometry: {
      $geoIntersects: {
        $geometry: { type: "Point", coordinates: [85.330131, 27.706267] },
      },
    },
  }); */

  res.status(200).json({
    status: "success",
    results: parkings.length,
    data: { parkings },
  });
});

exports.getAllNearbyParking = catchAsync(async (req, res) => {
  var METERS_PER_MILE = 1609.34;

  const parkings = await parkingModel
    .find({
      geometry: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [85.330131, 27.706267],
          },
          $maxDistance: 0.5 * METERS_PER_MILE,
        },
      },
    })
    .select("name description");
  res.status(200).json({
    status: "success",
    results: parkings.length,
    data: { parkings },
  });
});
