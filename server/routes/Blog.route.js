const express = require("express");
const { createBlog, getAllBlogs } = require("../controller/blog.controller");
const router = express.Router();

router.post("/create", createBlog);
router.get("/all/:page/:filter", getAllBlogs);

module.exports = router;
