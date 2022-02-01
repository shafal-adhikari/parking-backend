const userModel = require("../Model/User");
const fs = require("fs");
const { connectDB } = require("../server");
connectDB();

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));

const deletUserData = async () => {
  try {
    await userModel.deleteMany();
    console.log("data deleted successfully.");
  } catch (error) {
    console.error(error.message);
  }
};
const loadUserData = async () => {
  try {
    await userModel.create(users, { validateBeforeSave: false });
    console.log("data loaded successfully.");
  } catch (error) {
    console.error(error.message);
  }
};
if (process.argv[2] == "--delete-user-data") {
  deletUserData();
}
if (process.argv[2] == "--load-user-data") {
  loadUserData();
}
