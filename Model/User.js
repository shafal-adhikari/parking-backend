const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: 255,
    trim: true,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email",
      isAsync: false,
    },
    unique: true,
  },
  img: { data: Buffer, contentType: String },
  role: {
    type: String,
    enum: ["admin", "parker", "staff", "lead-staff"],
    default: "parker",
  },
  password: {
    type: String,
    minLength: [8, "Password should contain characters more than 8"],
    maxLength: [20, "Password should contain characters less than 20"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el == this.password;
      },
      message: "{VALUE} is not same as above password",
    },
  },
  resetPasswordToken: String,
  resetPasswordTokenExpires: Date,
  changedPasswordAt: Date,
});

userSchema.pre("save", async function (next) {
  //only run below code if the password is modified
  if (!this.isModified("password")) return next();
  //hash the password before saving in the database.
  this.password = await bcrypt.hash(this.password, 12);
  //deletes the confirm password field in database
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  password
) {
  return await bcrypt.compare(candidatePassword, password);
};
userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(30).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordTokenExpires = Date.now() + 60 * 10 * 1000;
  console.log({ resetToken }, this.resetPasswordToken);
  return resetToken;
};
userSchema.methods.changedPasswordAfter = function (jwtIssuedTime) {
  if (this.changedPasswordAt) {
    return this.changedPasswordAt.getTime() > jwtIssuedTime;
  }
  return false;
};

const User = mongoose.model("user", userSchema);
module.exports = User;
