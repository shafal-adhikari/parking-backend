const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const userModel = require("../Model/User");
const { catchAsync } = require("../utils/catchAsync");
module.exports = catchAsync(async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return next(new AppError("No token found! Authorization denied", 400));
  }
  const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedUser) {
    return next(
      new AppError("Token is not verified! Authorization denied.", 400)
    );
  }
  const currentUser = await userModel.findById(decodedUser.user.id);
  if (!currentUser) {
    return next(new AppError("User doesn't exist at present", 400));
  }
  if (currentUser.changedPasswordAfter(decodedUser.iat)) {
    return next(new AppError("User has changed his password recently.", 400));
  }

  req.user = decodedUser.user;
  next();
});
