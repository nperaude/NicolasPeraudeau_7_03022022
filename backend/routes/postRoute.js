const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const multer = require("../middleware/multer-configPost");

router.post("/", multer, postController.createPost);

router.get("/", postController.getAllPost);

router.post("/userPost", postController.userPost);

router.post("/postUserLike", postController.postUserLike);

router.post("/deletePost", postController.deletePost);

router.patch("/", postController.likeUnlikePost);

router.post("/getLike", postController.getLike);

module.exports = router;
