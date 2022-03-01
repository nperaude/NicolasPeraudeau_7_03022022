const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const postRoute = require("./routes/postRoute");
const userRoute = require("./routes/userRoute");
const commentRoute = require("./routes/commentRoute");

app.use(express.json());
app.use(cors());

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/comment", commentRoute);

module.exports = app;
