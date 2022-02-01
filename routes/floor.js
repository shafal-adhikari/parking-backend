const express = require("express");
const router = express.Router();
const floorController = require("../Controllers/floorController.js");

router.route("/").post(floorController.addFloor).get(floorController.getFloors);

module.exports = router;
