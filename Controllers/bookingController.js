const bookingModel = require("../Model/Booking");
const floorModel = require("../Model/Floor");
const slotModel = require("../Model/Slot");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.addBooking = catchAsync(async (req, res, next) => {
  const {
    parking: { slot, floor },
  } = req.body;
  const Slot = await slotModel.findOne({ _id: slot });
  let booking;
  if (Slot.isAvailable) {
    booking = await bookingModel.create({
      ...req.body,
      user: req.user.id,
    });
    Slot.isAvailable = false;
    await Slot.save({ validateBeforeSave: false });
    const bookedFloor = await floorModel.findOne({ _id: floor });
    if (req.body.vehicleType == "car") {
      bookedFloor.carSlot -= 1;
    } else if (req.body.vehicleType == "bike") {
      bookedFloor.bikeSlot -= 1;
    }
    await bookedFloor.save({ validateBeforeSave: false });
  } else {
    return next(
      new AppError("slot is already booked! Please try another slot", 400)
    );
  }

  res.status(200).json({
    status: "success",
    booking,
  });
});

exports.getBookings = catchAsync(async (req, res) => {
  let bookings = await bookingModel
    .find({ user: req.user.id })
    .select("-user")
    .populate({
      path: "parking",
      populate: {
        path: "slot floor parking",
      },
    });
  bookings = bookings.map((el, index) => {
    return {
      parking: bookings[index].parking.parking.name,
      location: bookings[index].parking.parking.location,
      floor: bookings[index].parking.floor.floor,
      slot: bookings[index].parking.slot.slot,
      vehicleType: bookings[index].vehicleType,
      startTime: bookings[index].startTime,
      endTime: bookings[index].endTime,
      date: bookings[index].date,
    };
  });
  res.status(200).json({
    status: "success",
    results: bookings.length,
    bookings,
  });
});
exports.editMyBooking = catchAsync(async (req, res) => {
  /*  const editedData = {
    vehicleType: req.body.vehicleType && req.body.vehicleType,
    startTime: req.body.startTime && req.body.startTime,
    endTime: req.body.endTime && req.body.endTime,
  }; */

  const editedBooking = await bookingModel.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    {
      runValidators: true,
    }
  );
  res.status(204).json({
    status: "success",
    editedBooking: editedBooking,
  });
});
exports.cancelBooking = catchAsync(async (req, res) => {
  const toBeDeletedBooking = await bookingModel.findOne({
    _id: req.params.id,
    user: req.user.id,
  });
  await bookingModel.findByIdAndRemove(toBeDeletedBooking.id);
  res.status(204).json({
    status: "success",
    message: "resource deleted successfully",
  });
});
