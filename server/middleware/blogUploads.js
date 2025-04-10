const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Helper function to ensure directory exists
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configure storage dynamically based on fieldname
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    // Determine path based on the field name from the client's FormData
    if (file.fieldname === "file") {
      // For the single document upload
      uploadPath = path.join(__dirname, "../uploads/blogFiles");
    } else if (file.fieldname === "images") {
      // For the image uploads
      uploadPath = path.join(__dirname, "../uploads/blogImages");
    } else {
      // Handle unexpected fields if necessary, or default to a general path
      // For now, let's assume only 'file' and 'images' are expected
      return cb(new Error("Invalid upload field specified"));
    }
    ensureDirExists(uploadPath); // Ensure the target directory exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`); // Replace spaces for safety
  },
});

// Configure file filter dynamically based on fieldname
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "file") {
    // Allowed document types
    const filetypes = /pdf|doc|docx|txt|xlsx|csv/; // Customize as needed
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (extname) {
      return cb(null, true); // Accept file
    }
    cb(
      new Error(
        "Invalid file type. Only specific documents (PDF, DOCX, TXT, XLSX, CSV) are allowed!"
      )
    ); // Reject file
  } else if (file.fieldname === "images") {
    // Allowed image types
    const filetypes = /jpeg|jpg|png|gif/; // Added gif as common type
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true); // Accept file
    }
    cb(
      new Error("Invalid image type. Only JPEG, PNG, GIF images are allowed!")
    ); // Reject file
  } else {
    cb(new Error("Unexpected file field received")); // Reject unexpected fields
  }
};

// Create the Multer instance with combined configurations
const uploadBlogMedia = multer({
  storage: storage, // Use the dynamic storage configuration
  fileFilter: fileFilter, // Use the dynamic file filter
  limits: {
    fileSize: 20 * 1024 * 1024, // Set a general max file size (e.g., 20MB) - adjust as needed
    // Note: We lose the per-type file size limit easily with .fields()
    // It applies to *all* uploads handled by this middleware.
  },
}).fields([
  // Define the expected fields and their counts
  // The 'name' MUST match the key used in your FormData on the frontend
  { name: "file", maxCount: 1 }, // For the 'file' blog type (single file)
  { name: "images", maxCount: 10 }, // For the 'images' blog type (up to 10 images)
]);

// Export the single, combined middleware function
module.exports = {
  uploadBlogMedia, // Use this single middleware in your route definitions
};
