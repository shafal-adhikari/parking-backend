const express = require("express");
const app = express();
const userRouter = require("./routes/userRouter");
const parkingRouter = require("./routes/parking");
const floorRouter = require("./routes/floor");
const slotRouter = require("./routes/slot");
const bookingRouter = require("./routes/booking");
const globalErrorHandler = require("./Controllers/errorController");
const cookieParser = require("cookie-parser");

//for parsing body object in request
app.use(express.json());
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("home");
});
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/users", userRouter);
app.use("/api/v1/parkings", parkingRouter);
app.use("/api/v1/floors", floorRouter);
app.use("/api/v1/slots", slotRouter);
app.use("/api/v1/bookings", bookingRouter);

/* app.use("/", uploadRouter); */

//global error handling middleware which catches all the error sent with next function.
app.use(globalErrorHandler);
module.exports = app;
