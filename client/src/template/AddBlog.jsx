import { useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoMdCloudUpload, IoMdDocument, IoMdImage } from "react-icons/io"; // Added icons
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../api/endpoints/blogs";

const MAX_IMAGES = 10;

const AddBlog = () => {
  const [blogType, setBlogType] = useState("content"); // Default type
  const [imagePreviews, setImagePreviews] = useState([]);
  const [filePreview, setFilePreview] = useState(null); // Store file name or basic info
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // --- File & Image Handlers ---

  const handleFileChange = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file) {
        formik.setFieldValue("file", file);
        setFilePreview(file.name); // Store file name for preview
        setImagePreviews([]); // Clear image previews if switching type implicitly
      } else {
        formik.setFieldValue("file", null);
        setFilePreview(null);
      }
    },
    [formik]
  ); // Add formik to dependency array

  const handleImagesChange = useCallback(
    (event) => {
      const files = Array.from(event.target.files); // Convert FileList to Array

      if (files.length > MAX_IMAGES) {
        toast.error(`You can upload a maximum of ${MAX_IMAGES} images.`);
        // Keep existing selection or clear it based on desired UX
        // formik.setFieldValue("images", []); // Option: Clear selection
        // setImagePreviews([]);          // Option: Clear previews
        return; // Prevent updating formik state if too many files selected
      }

      if (files.length > 0) {
        formik.setFieldValue("images", files);
        setFilePreview(null); // Clear file preview

        // Generate previews
        const previewUrls = [];
        const readers = [];
        files.forEach((file) => {
          const reader = new FileReader();
          readers.push(
            new Promise((resolve) => {
              reader.onloadend = () => {
                previewUrls.push(reader.result);
                resolve();
              };
              reader.readAsDataURL(file);
            })
          );
        });
        // Update previews once all files are read
        Promise.all(readers).then(() => {
          setImagePreviews(previewUrls);
        });
      } else {
        formik.setFieldValue("images", []);
        setImagePreviews([]);
      }
    },
    [formik]
  ); // Add formik to dependency array

  const handleBlogTypeChange = (e) => {
    const newType = e.target.value;
    setBlogType(newType);
    formik.setFieldValue("blogType", newType);

    // Reset fields not relevant to the new type to clear values and validation
    if (newType !== "file") {
      formik.setFieldValue("file", null);
      setFilePreview(null);
    }
    if (newType !== "images") {
      formik.setFieldValue("images", []);
      setImagePreviews([]);
    }
    if (newType !== "content") {
      formik.setFieldValue("content", "");
    }
    // Reset touched status for fields being hidden to prevent lingering errors
    formik.setTouched(
      {
        title: formik.touched.title,
        description: formik.touched.description,
        // Keep touched status only for relevant fields
        file: newType === "file" ? formik.touched.file : false,
        images: newType === "images" ? formik.touched.images : false,
        content: newType === "content" ? formik.touched.content : false,
        blogType: true, // Always mark blogType as touched on change
      },
      false
    ); // 'false' means don't run validation after resetting touched
  };

  // --- Formik Setup ---

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      content: "",
      file: null,
      images: [],
      blogType: "content", // Match initial state
    },
    validationSchema: Yup.object().shape({
      blogType: Yup.string().required("Blog type is required"),
      title: Yup.string().required("Blog title is required"),
      description: Yup.string().required("Blog description is required"),
      // Conditional validation based on blogType
      file: Yup.mixed().when("blogType", {
        is: "file",
        then: (schema) => schema.required("A file is required for File Blog"),
        otherwise: (schema) => schema.nullable(), // Or .notRequired()
      }),
      images: Yup.array().when("blogType", {
        is: "images",
        then: (schema) =>
          schema
            .min(1, "At least one image is required for Images Blog")
            .max(MAX_IMAGES, `Maximum ${MAX_IMAGES} images allowed`),
        otherwise: (schema) => schema.notRequired(),
      }),
      content: Yup.string().when("blogType", {
        is: "content",
        then: (schema) =>
          schema.required("Content is required for Content Blog"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      const formData = new FormData();

      // Append common fields
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("blogType", values.blogType); // Send type info if backend needs it

      // Append type-specific fields
      switch (values.blogType) {
        case "file":
          if (values.file) {
            formData.append("file", values.file); // Use 'file' key for single file
          }
          break;
        case "images":
          if (values.images && values.images.length > 0) {
            values.images.forEach((img) => {
              formData.append("images", img); // Use 'images' key for multiple files
            });
          }
          break;
        case "content":
          formData.append("content", values.content);
          break;
        default:
          toast.error("Invalid blog type selected");
          setIsSubmitting(false);
          return;
      }

      // Call API
      try {
        const response = await createBlog(formData);
        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("Blog created successfully!");
          resetForm();
          setImagePreviews([]);
          setFilePreview(null);
          setBlogType("content"); // Reset dropdown to default
          // navigate("/admin/allBlogs"); // Redirect to blogs list (adjust path)
          navigate(-1); // Or navigate back
        }
      } catch (error) {
        // Catch any unexpected errors during API call
        console.error("Submission error:", error);
        toast.error("An unexpected error occurred while creating the blog.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // --- JSX ---
  return (
    <div className="lg:col-span-3 w-full mx-auto p-6 bg-white rounded-lg lg:ml-6 border">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">
        Add New Blog Post
      </h2>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full flex flex-col gap-5 mx-auto" // Increased gap slightly
      >
        {/* Blog Type Selector */}
        <div>
          <label
            htmlFor="blogType"
            className="block text-gray-700 mb-2 font-medium"
          >
            Blog Type
          </label>
          <select
            id="blogType"
            name="blogType"
            value={formik.values.blogType}
            onChange={handleBlogTypeChange} // Use custom handler
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${
              formik.touched.blogType && formik.errors.blogType
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out`}
          >
            <option value="content">Content Blog</option>
            <option value="file">File Blog</option>
            <option value="images">Images Blog</option>
          </select>
          {formik.touched.blogType && formik.errors.blogType && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.blogType}
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-gray-700 mb-2 font-medium"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="Blog Post Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${
              formik.touched.title && formik.errors.title
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out`}
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.title}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-gray-700 mb-2 font-medium"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Short description or summary..."
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${
              formik.touched.description && formik.errors.description
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out`}
            rows="3"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.description}
            </div>
          )}
        </div>

        {/* --- Conditional Fields --- */}

        {/* File Blog Fields */}
        {blogType === "file" && (
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Upload File
            </h3>
            <label
              htmlFor="file"
              className="block text-gray-700 mb-2 font-medium"
            >
              Blog File
            </label>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="file"
                className="cursor-pointer bg-blue-600 w-12 h-12 flex justify-center items-center hover:bg-blue-700 text-white rounded-md transition-all duration-300"
                title="Upload File"
              >
                <IoMdCloudUpload className="text-2xl" />
              </label>
              <input
                id="file"
                name="file"
                type="file"
                // accept=".pdf,.doc,.docx,.txt,.zip" // Add specific accepted file types
                onChange={handleFileChange}
                className="hidden"
              />
              {filePreview && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                  <IoMdDocument className="text-lg text-blue-500" />
                  <span>{filePreview}</span>
                </div>
              )}
            </div>

            {formik.touched.file && formik.errors.file && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.file}
              </div>
            )}
          </div>
        )}

        {/* Images Blog Fields */}
        {blogType === "images" && (
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Upload Images (Max {MAX_IMAGES})
            </h3>
            <label
              htmlFor="images"
              className="block text-gray-700 mb-2 font-medium"
            >
              Blog Images
            </label>
            <div className="flex items-center space-x-4 mb-4">
              <label
                htmlFor="images"
                className="cursor-pointer bg-purple-600 w-12 h-12 flex justify-center items-center hover:bg-purple-700 text-white rounded-md transition-all duration-300"
                title={`Upload Images (Max ${MAX_IMAGES})`}
              >
                <IoMdImage className="text-2xl" />
              </label>
              <input
                id="images"
                name="images"
                type="file"
                multiple // Allow multiple file selection
                accept="image/png, image/jpeg, image/jpg, image/gif" // Specify image types
                onChange={handleImagesChange}
                className="hidden"
              />
              <span className="text-sm text-gray-500">
                {formik.values.images.length} image(s) selected
              </span>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 border p-4 rounded-md bg-gray-50">
                {imagePreviews.map((previewUrl, index) => (
                  <img
                    key={index}
                    src={previewUrl}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md border border-gray-300"
                  />
                ))}
              </div>
            )}

            {formik.touched.images && formik.errors.images && (
              <div className="text-red-500 text-sm mt-1">
                {Array.isArray(formik.errors.images)
                  ? formik.errors.images.join(", ")
                  : formik.errors.images}
              </div>
            )}
          </div>
        )}

        {/* Content Blog Fields */}
        {blogType === "content" && (
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Blog Content
            </h3>
            <label
              htmlFor="content"
              className="block text-gray-700 mb-2 font-medium"
            >
              Full Content
            </label>
            <textarea
              id="content"
              name="content"
              placeholder="Write your full blog post content here. You can use HTML or Markdown if your backend/display supports it."
              value={formik.values.content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`block w-full px-4 py-2 border ${
                formik.touched.content && formik.errors.content
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out`}
              rows="10" // Larger text area for content
            />
            {formik.touched.content && formik.errors.content && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.content}
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !formik.isValid} // Disable if submitting or form is invalid
          className={`w-full px-4 py-3 mt-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${
            isSubmitting || !formik.isValid
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {isSubmitting ? "Creating Blog..." : "Create Blog Post"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
