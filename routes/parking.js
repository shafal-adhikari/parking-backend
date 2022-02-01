const express = require("express");
const router = express.Router();
const parkingController = require("../Controllers/parkingController");

var multer = require("multer");

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.route("/getAllNearbyParking").get(parkingController.getAllNearbyParking);
router
  .route("/getParkingWithinDistance")
  .get(parkingController.getParkingWithinDistance);
router
  .route("/")
  .get(parkingController.getParkings)
  .post(upload.single("image"), parkingController.addParking);

router
  .route("/:id")
  .get(parkingController.getParking)
  .patch(parkingController.updateParking)
  .delete(parkingController.deleteParking);

module.exports = router;
