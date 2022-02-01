const express = require("express");
const router = express.Router();
const bookingController = require("../Controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

router.route("/").post(authMiddleware, bookingController.addBooking);

router.get("/getMyBookings", authMiddleware, bookingController.getBookings);
router.delete(
  "/deleteMyBooking/:id",
  authMiddleware,
  bookingController.cancelBooking
);

router.patch(
  "/editMyBooking/:id",
  authMiddleware,
  bookingController.editMyBooking
);

module.exports = router;
