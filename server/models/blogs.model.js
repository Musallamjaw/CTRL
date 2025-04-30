const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  blogType: {
    type: String,
    enum: ["content", "file", "images", "link"], // Added "link"
    required: true,
  },
  content: {
    type: String,
  },
  files: [
    {
      type: String, // URL of uploaded file
    },
  ],
  images: {
    type: [String], // Array of image URLs
    validate: [(arr) => arr.length <= 10, "Max 10 images allowed"],
  },
  imageSize: {
    type: String,
    enum: ["square", "sixByNine"],
    default: "square",
    required: function () {
      return this.blogType === "images";
    },
  },
  link: {
    type: String,
    trim: true,
    required: function () {
      return this.blogType === "link";
    },
  },
  published: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Blog = mongoose.model("Blog", blogSchema, "Blog");
module.exports = Blog;
