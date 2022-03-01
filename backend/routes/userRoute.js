const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const multer = require("../middleware/multer-configUser");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/infos", userController.getInfo);

router.post("/updateUser", userController.updateUser);
router.post("/updatePhotoProfil", multer, userController.updatePhotoProfil);
router.post("/delete", userController.deleteUser);

module.exports = router;
