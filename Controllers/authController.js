const userModel = require("../Model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
var CLIENT_ID =
  "647838998708 - kn4j8p9b15cg1a46ae7nkb8stodd7tv4.apps.googleusercontent.com";

const client = new OAuth2Client(CLIENT_ID);

var multer = require("multer");

var storage = multer.memoryStorage();
var upload = multer({
  dest: "uploads/",
  storage: storage,
});

const signToken = async (payload) => {
  let token;
  try {
    token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    return token;
  } catch (error) {
    throw new Error(error);
  }
};

exports.signUp = catchAsync(async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (user) {
    return next(new AppError("user already exists", 400));
  }
  user = new userModel({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  console.log(req.file);
  if (req.file) {
    user.img.data = req.file.buffer;
    user.img.contentType = "image/jpg";
  }

  await user.save({ validateBeforeSave: false });

  /* user.img.data = req.file.buffer;
  user.img.contentType = "image/jpg";

  await user.save({ validateBeforeSave: false }); */

  const payload = {
    user: {
      id: user._id,
    },
  };
  const token = await signToken(payload);
  res.status(201).json({
    status: "success",
    token: token,
    data: {
      user: user,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("please enter both email and password!", 400));
  }
  let user = await userModel.findOne({ email }).select("+password");
  console.log(user, "user");
  if (!user) {
    next(new AppError("Invalid credentails! User doesn't exists.", 400));
  }
  const isMatch = await user.correctPassword(password, user.password);
  if (!isMatch) {
    return next(new AppError("Invalid credentails! please try again", 400));
  }
  const payload = {
    user: {
      id: user._id,
    },
  };
  const token = await signToken(payload);
  user.password = undefined;

  res.status(200).json({
    status: "success",
    token,
    user,
  });
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  //checking if the user with the given email exists.
  if (!user) {
    return next(
      new AppError("There is not any user with the given email", 400)
    );
  }
  const resetToken = user.createResetPasswordToken();
  //saving the user cause createResetToken is adding resetToken to the user document.
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.hostname}/api/v1/resetPassword/${resetToken}`;
  const message = `You can do the patch request with the new password in the given reset URL ${resetURL}. please ignore this message if you didn't forget your password`;
  try {
    await sendEmail({
      email: user.email,
      message: "Your password reset token( only valid for 10 minutes)",
      text: message,
    });
    res.status(200).json({
      status: "success",
      message: "reset token sent to the email.",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(error.message);
    return next(new AppError("There was an error sending an email", 500));
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  const resetToken = req.params.token;
  const hasedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const user = await userModel.findOne({
    resetPasswordToken: hasedToken,
    resetPasswordTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Token is not valid or already expired", 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpires = undefined;
  await user.save();

  const payload = {
    user: {
      id: user._id,
    },
  };
  const token = await signToken(payload);
  res.status(200).json({
    status: "success",
    token,
  });
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  console.log(req.user._id);
  const user = await userModel.findById(req.user.id).select("+password");
  if (!user) {
    return next(
      new AppError("Please login first to update your password", 400)
    );
  }
  const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
  if (!isMatch) {
    return next(new AppError("please enter the correct password", 400));
  }
  if (req.body.currentPassword == req.body.newPassword) {
    return next(
      new AppError(
        "You entered the same previous password! please enter new password",
        400
      )
    );
  }
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmPassword;
  user.changedPasswordAt = Date.now();
  await user.save();

  const payload = {
    user: {
      id: user._id,
    },
  };
  const token = await signToken(payload);
  res.status(200).json({
    status: "success",
    token,
  });
});
exports.loginFromGoogle = (req, res) => {
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: req.body.token,
      requiredAudience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    const userid = payload["sub"];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
  }
  verify()
    .then(() => {
      res.cookie("session-token", req.body.token);
    })
    .catch(console.error);
};
