const multer = require("multer"); // Import multer to check for MulterError instances
const path = require("path");
const Blog = require("../models/blogs.model");
const { uploadBlogMedia } = require("../middleware/blogUploads");

exports.createBlog = async (req, res) => {
  // 1. Call the Multer middleware
  uploadBlogMedia(req, res, async (err) => {
    // 2. Handle Multer-specific errors first
    if (err) {
      console.error("Multer Error:", err);
      if (err instanceof multer.MulterError) {
        // Handle specific Multer errors (e.g., file size limits)
        return res.status(400).json({
          success: false,
          message: `File upload error: ${err.message}. Please check file size and type limits.`,
        });
      } else {
        // Handle custom errors from fileFilter or other issues
        return res.status(400).json({
          success: false,
          message: err.message || "File upload failed.",
        });
      }
    }

    // 3. Proceed with logic if Multer succeeded (or wasn't needed for 'content' type)
    try {
      const { title, description, blogType, content } = req.body;

      // 4. Validate required text fields and blogType
      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: "Title and description are required.",
        });
      }
      const validBlogTypes = ["file", "images", "content"];
      if (!blogType || !validBlogTypes.includes(blogType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid or missing blogType. Must be one of: ${validBlogTypes.join(
            ", "
          )}`,
        });
      }

      // 5. Prepare variables for blog data
      let fileUrl = null;
      let imageUrls = [];
      let finalContent = content || null; // Use provided content or default to null

      // 6. Type-specific validation and data extraction from req.files
      switch (blogType) {
        case "file":
          // req.files.file will be an array (max 1 element due to config) or undefined
          const uploadedFile = req.files?.file?.[0]; // Safely access the first file
          if (!uploadedFile) {
            return res.status(400).json({
              success: false,
              message: "A file upload is required for 'file' blog type.",
            });
          }
          fileUrl = `/uploads/blogFiles/${uploadedFile.filename}`;
          finalContent = null; // Ensure content is null for file blogs
          imageUrls = []; // Ensure images are empty
          break;

        case "images":
          // req.files.images will be an array (max 10 elements) or undefined
          const uploadedImages = req.files?.images;
          if (!uploadedImages || uploadedImages.length === 0) {
            return res.status(400).json({
              success: false,
              message:
                "At least one image upload is required for 'images' blog type.",
            });
          }
          // Max 10 images is already enforced by multer config in uploadBlogMedia
          imageUrls = uploadedImages.map(
            (file) => `/uploads/blogImages/${file.filename}`
          );
          finalContent = null; // Ensure content is null for image blogs
          fileUrl = null; // Ensure file is null
          break;

        case "content":
          if (!finalContent || finalContent.trim() === "") {
            return res.status(400).json({
              success: false,
              message: "Content is required for 'content' blog type.",
            });
          }
          // No file uploads expected for 'content' type
          if (req.files?.file?.length > 0 || req.files?.images?.length > 0) {
            console.warn(
              `Files uploaded for 'content' blog type for title "${title}". These files will be ignored.`
            );
            // Optional: Add logic here to delete ignored uploaded files if necessary
          }
          fileUrl = null; // Ensure file is null for content blogs
          imageUrls = []; // Ensure images are empty
          break;
        // No default needed as blogType is validated above
      }

      // 7. Create new Blog document
      const newBlog = new Blog({
        title,
        description,
        content: finalContent,
        blogType,
        // Schema expects 'files' as an array, even for single file
        files: fileUrl ? [fileUrl] : [],
        images: imageUrls,
        published: false, // Default to not published
        // blogType: blogType // Optionally store the type itself
      });

      // 8. Save to database
      const savedBlog = await newBlog.save();

      // 9. Return success response
      return res.status(201).json({
        success: true,
        message: "Blog created successfully",
        blog: savedBlog, // Return the created blog document
      });
    } catch (error) {
      // 10. Handle potential errors during validation or saving
      console.error("Error creating blog:", error);
      // Handle Mongoose validation errors specifically
      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: `Validation Failed: ${error.message}`,
        });
      }
      // Generic server error
      return res.status(500).json({
        success: false,
        message: "Failed to create blog due to an internal error.",
        error: error.message, // Provide error message in response (consider security implications)
      });
    }
  }); // End of uploadBlogMedia callback
};

// Get all Blogs with pagination and filtering
exports.getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 4;
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
