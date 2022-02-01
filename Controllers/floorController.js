const floorModel = require("../Model/Floor");
const { catchAsync } = require("../utils/catchAsync");

exports.addFloor = catchAsync(async (req, res) => {
  const newFloor = await floorModel.create(req.body);
  res.status(200).json({
    status: "success",
    data: newFloor,
  });
});
exports.getFloors = catchAsync(async (req, res) => {
  const floors = await floorModel.find({}).populate({ path: "slots" });
  res.status(200).json({
    status: "success",
    data: floors,
  });
});
