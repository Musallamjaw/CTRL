const fs = require("fs");
const multer = require("multer"); // Import multer to check for MulterError instances
const path = require("path");
const Blog = require("../models/blogs.model");
const { uploadBlogMedia } = require("../middleware/blogUploads");

exports.createBlog = async (req, res) => {
  uploadBlogMedia(req, res, async (err) => {
    if (err) {
      console.error("Multer Error:", err);
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: `File upload error: ${err.message}. Please check file size and type limits.`,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: err.message || "File upload failed.",
        });
      }
    }

    try {
      const { title, description, blogType, content, imageSize, link } =
        req.body;

      let selectedImageSize = null;
      if (blogType === "images") {
        const validImageSizes = ["square", "sixByNine"];
        if (!imageSize || !validImageSizes.includes(imageSize)) {
          return res.status(400).json({
            success: false,
            message: `Invalid or missing imageSize. Must be one of: ${validImageSizes.join(
              ", "
            )}`,
          });
        }
        selectedImageSize = imageSize;
      }

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: "Title and description are required.",
        });
      }

      const validBlogTypes = ["file", "images", "content", "link"];
      if (!blogType || !validBlogTypes.includes(blogType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid or missing blogType. Must be one of: ${validBlogTypes.join(
            ", "
          )}`,
        });
      }

      let fileUrl = null;
      let imageUrls = [];
      let finalContent = content || null;
      let finalLink = null;

      switch (blogType) {
        case "file":
          const uploadedFile = req.files?.file?.[0];
          if (!uploadedFile) {
            return res.status(400).json({
              success: false,
              message: "A file upload is required for 'file' blog type.",
            });
          }
          fileUrl = `/uploads/blogFiles/${uploadedFile.filename}`;
          finalContent = null;
          imageUrls = [];
          break;

        case "images":
          const uploadedImages = req.files?.images;
          if (!uploadedImages || uploadedImages.length === 0) {
            return res.status(400).json({
              success: false,
              message:
                "At least one image upload is required for 'images' blog type.",
            });
          }
          imageUrls = uploadedImages.map(
            (file) => `/uploads/blogImages/${file.filename}`
          );
          finalContent = null;
          fileUrl = null;
          break;

        case "content":
          if (!finalContent || finalContent.trim() === "") {
            return res.status(400).json({
              success: false,
              message: "Content is required for 'content' blog type.",
            });
          }
          fileUrl = null;
          imageUrls = [];
          break;

        case "link":
          if (!link) {
            return res.status(400).json({
              success: false,
              message: "A valid URL is required for 'link' blog type.",
            });
          }
          finalLink = link.trim();
          finalContent = null;
          fileUrl = null;
          imageUrls = [];
          break;
      }

      const newBlog = new Blog({
        title,
        description,
        content: finalContent,
        blogType,
        files: fileUrl ? [fileUrl] : [],
        images: imageUrls,
        imageSize: selectedImageSize,
        link: finalLink,
        published: false,
      });

      const savedBlog = await newBlog.save();

      return res.status(201).json({
        success: true,
        message: "Blog created successfully",
        blog: savedBlog,
      });
    } catch (error) {
      console.error("Error creating blog:", error);
      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: `Validation Failed: ${error.message}`,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Failed to create blog due to an internal error.",
        error: error.message,
      });
    }
  });
};

// Get all Blogs with pagination and filtering
exports.getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = req.params.filter || "all";

    let query = {};
    if (filter !== "all") {
      query.blogType = filter;
    }

    const Blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: Blogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBlogs / limit),
        totalBlogs,
      },
    });
  } catch (error) {
    console.error("Error fetching Blogs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Blogs",
      error: error.message,
    });
  }
};

exports.publishBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const isPublished = blog.published;
    blog.published = !isPublished;
    await blog.save();

    return res.status(200).json({
      success: true,
      message: isPublished
        ? "Blog unpublished successfully"
        : "Blog published successfully",
    });
  } catch (error) {
    console.error("Error publishing Blog:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to publish Blog",
      error: error.message,
    });
  }
};

exports.publishedBlogs = async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    const blogs = await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalBlogs = await Blog.countDocuments({ published: true });
    const totalPages = Math.ceil(totalBlogs / limit);
    return res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        total: totalBlogs,
        limit,
        page,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching published Blogs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch published Blogs",
      error: error.message,
    });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Error fetching Blog by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Blog by ID",
      error: error.message,
    });
  }
};

exports.updateBlog = async (req, res) => {
  const blogId = req.params.id;

  uploadBlogMedia(req, res, async (err) => {
    if (err) {
      console.error("Multer Error:", err);
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: `File upload error: ${err.message}`,
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed.",
      });
    }

    try {
      const {
        title,
        description,
        blogType,
        content,
        imageSize,
        existingImages,
        link,
      } = req.body;

      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found.",
        });
      }

      const validBlogTypes = ["file", "images", "content", "link"];
      if (!blogType || !validBlogTypes.includes(blogType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid blogType. Must be one of: ${validBlogTypes.join(
            ", "
          )}`,
        });
      }

      let selectedImageSize = null;
      if (blogType === "images") {
        const validImageSizes = ["square", "sixByNine"];
        if (!imageSize || !validImageSizes.includes(imageSize)) {
          return res.status(400).json({
            success: false,
            message: `Invalid or missing imageSize. Must be one of: ${validImageSizes.join(
              ", "
            )}`,
          });
        }
        selectedImageSize = imageSize;
      }

      let fileUrl = null;
      let imageUrls = [];
      let finalContent = content || null;
      let finalLink = null;

      switch (blogType) {
        case "file":
          const uploadedFile = req.files?.file?.[0];
          if (!uploadedFile && !blog.files.length) {
            return res.status(400).json({
              success: false,
              message: "A file is required for 'file' blog type.",
            });
          }
          fileUrl = uploadedFile
            ? `/uploads/blogFiles/${uploadedFile.filename}`
            : blog.files[0];
          finalContent = null;
          imageUrls = [];
          break;

        case "images":
          const uploadedImages = req.files?.images || [];
          const retainedImages = Array.isArray(existingImages)
            ? existingImages
            : existingImages
            ? [existingImages]
            : [];

          const newImageUrls = uploadedImages.map(
            (img) => `/uploads/blogImages/${img.filename}`
          );
          imageUrls = [...retainedImages, ...newImageUrls];

          if (imageUrls.length === 0) {
            return res.status(400).json({
              success: false,
              message: "At least one image is required for 'images' blog type.",
            });
          }

          const removedImages = blog.images.filter(
            (img) => !retainedImages.includes(img)
          );
          for (const imgPath of removedImages) {
            const absolutePath = path.join(__dirname, "..", imgPath);
            fs.unlink(absolutePath, (err) => {
              if (err) {
                console.error(`Failed to delete ${imgPath}:`, err.message);
              } else {
                console.log(`Deleted old image: ${imgPath}`);
              }
            });
          }

          finalContent = null;
          fileUrl = null;
          break;

        case "content":
          if (!finalContent || finalContent.trim() === "") {
            return res.status(400).json({
              success: false,
              message: "Content is required for 'content' blog type.",
            });
          }
          fileUrl = null;
          imageUrls = [];
          break;

        case "link":
          if (!link) {
            return res.status(400).json({
              success: false,
              message: "A valid URL is required for 'link' blog type.",
            });
          }
          finalLink = link.trim();
          finalContent = null;
          fileUrl = null;
          imageUrls = [];
          break;
      }

      blog.title = title || blog.title;
      blog.description = description || blog.description;
      blog.blogType = blogType;
      blog.files = fileUrl ? [fileUrl] : [];
      blog.images = imageUrls;
      blog.content = finalContent;
      blog.link = finalLink;
      blog.imageSize = selectedImageSize;
      blog.updatedAt = Date.now();

      const updatedBlog = await blog.save();

      return res.status(200).json({
        success: true,
        message: "Blog updated successfully.",
        blog: updatedBlog,
      });
    } catch (error) {
      console.error("Error updating blog:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update blog due to an internal error.",
        error: error.message,
      });
    }
  });
};

exports.deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    // 1. Validate blogId presence
    if (!blogId) {
      return res.status(400).json({
        success: false,
        message: "Missing blog ID in request.",
      });
    }

    // 2. Fetch the blog document
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    // 3. Delete associated files from disk (if any)
    // Delete file uploads
    if (blog.files && blog.files.length > 0) {
      blog.files.forEach((filePath) => {
        const absolutePath = path.join(__dirname, "..", filePath);
        fs.unlink(absolutePath, (err) => {
          if (err) {
            console.warn(`Failed to delete file: ${filePath}`, err.message);
          } else {
            console.log(`Deleted file: ${filePath}`);
          }
        });
      });
    }

    // Delete image uploads
    if (blog.images && blog.images.length > 0) {
      blog.images.forEach((imgPath) => {
        const absolutePath = path.join(__dirname, "..", imgPath);
        fs.unlink(absolutePath, (err) => {
          if (err) {
            console.warn(`Failed to delete image: ${imgPath}`, err.message);
          } else {
            console.log(`Deleted image: ${imgPath}`);
          }
        });
      });
    }

    // 4. Delete the blog from DB
    await blog.deleteOne();

    // 5. Respond with success
    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete blog due to an internal error.",
      error: error.message,
    });
  }
};
