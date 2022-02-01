require("dotenv").config();
const PORT = process.env.PORT || 3000;
const server = require("./app");
const mongoose = require("mongoose");

const databaseURI = process.env.MONGO_URI;
const connectDB = (exports.connectDB = async () => {
  try {
    await mongoose.connect(databaseURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("mongodb connected successfully");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
});
connectDB();

server.listen(PORT, () => {
  console.log("server is started in port", PORT);
});
