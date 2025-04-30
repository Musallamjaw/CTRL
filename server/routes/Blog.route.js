const express = require("express");
const {
  createBlog,
  getAllBlogs,
  publishBlog,
  publishedBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../controller/blog.controller");
const router = express.Router();

router.post("/create", createBlog);
router.post("/update/:id", updateBlog);
router.get("/all/:page/:filter", getAllBlogs);
router.put("/publish/:id", publishBlog);
router.get("/published", publishedBlogs);
router.get("/blogById/:id", getBlogById);
router.delete("/blog/:blogId", deleteBlog);

module.exports = router;
