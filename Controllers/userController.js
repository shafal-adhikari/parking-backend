const userModel = require("../Model/User");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await userModel.find().select("-password");
    res.status(200).json({
      status: "success",
      results: users.length,
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Couldn't find the doc with the given ID",
      });
    }
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.addUser = async (req, res, next) => {
  try {
    const user = await userModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.updateUser = async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Couldn't find the user with the given ID",
      });
    }
    res.status(200).json({
      message: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.deleteUser = async (req, res, next) => {
  try {
    await userModel.findByIdAndRemove(req.params.id);
    res.status(204).json({});
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
