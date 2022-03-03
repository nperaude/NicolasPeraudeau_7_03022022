const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const multer = require("../middleware/multer-configPost");
const auth = require("../middleware/auth");

router.post("/", auth, multer, postController.createPost);

router.get("/", auth, postController.getAllPost);

router.post("/userPost", auth, postController.userPost);

router.post("/postUserLike", auth, postController.postUserLike);

router.post("/deletePost", auth, postController.deletePost);

router.patch("/", auth, postController.likeUnlikePost);

router.post("/getLike", auth, postController.getLike);

module.exports = router;
