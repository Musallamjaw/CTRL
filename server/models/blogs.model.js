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
  content: {
    type: String,
    required: true, // full HTML or markdown content
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
  published: {
    type: Boolean,
    default: false, // Admin controls this flag
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Blog = mongoose.model("Blog", blogSchema, "Blog");
module.exports = Blog;
