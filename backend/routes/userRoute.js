const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const multer = require("../middleware/multer-configUser");
const auth = require("../middleware/auth");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/infos", auth, userController.getInfo);

router.post("/updateUser", auth, userController.updateUser);
router.post(
  "/updatePhotoProfil",
  auth,
  multer,
  userController.updatePhotoProfil
);
router.post("/delete", auth, userController.deleteUser);

module.exports = router;
