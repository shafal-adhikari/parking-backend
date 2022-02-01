const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const authController = require("../Controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
var multer = require("multer");

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.post("/login", authController.login);
router.post("/googleLogin", authController.loginFromGoogle);
router.post("/signup", upload.single("image"), authController.signUp);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch("/updatePassword", authMiddleware, authController.updatePassword);

router.route("/").post(userController.addUser).get(userController.getUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
module.exports = router;
