import PropTypes from "prop-types";
import { IoMdDocument, IoMdTime } from "react-icons/io";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { updateBlog } from "../../api/endpoints/blogs";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) {
    return text;
  }
  return text.substr(0, maxLength) + "...";
};

const MAX_IMAGES = 10;

const EditModal = ({ blog, onClose }) => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [filePreview, setFilePreview] = useState(null);
  const [initialData, setInitialData] = useState(null); // Store initial data

  useEffect(() => {
    if (blog.blogType === "images") {
      setExistingImages(blog.images);
      const previews = blog.images.map(
        (img) => `https://api.ctrl-club.com${img}`
      );
      setImagePreviews(previews);
    } else if (blog.blogType === "file") {
      setFilePreview(`https://api.ctrl-club.com${blog.files[0]}`);
    }

    // Store initial form data
    setInitialData({
      title: blog.title || "",
      description: blog.description || "",
      content: blog.content || "",
      file: null,
      images: [],
      blogType: blog.blogType || "content",
      imageSize: blog.imageSize || "square",
      link: blog.link || "", // New field for the link
    });
  }, [blog]);

  const formik = useFormik({
    initialValues: {
      title: blog.title || "",
      description: blog.description || "",
      content: blog.content || "",
      file: null,
      images: [],
      blogType: blog.blogType || "content",
      imageSize: blog.imageSize || "square",
      link: blog.link || "", // New field for the link
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      blogType: Yup.string().required("Blog type is required"),
      imageSize: Yup.string().when("blogType", {
        is: "images",
        then: (schema) =>
          schema
            .oneOf(["square", "sixByNine"])
            .required("Image size is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      file: Yup.mixed().when("blogType", {
        is: "file",
        then: (schema) => schema.required("File is required"),
        otherwise: (schema) => schema.nullable(),
      }),
      // images: Yup.array().when("blogType", {
      //   is: "images",
      //   then: (schema) =>
      //     schema.test(
      //       "combined-images-count",
      //       `You must have at least 1 and no more than ${MAX_IMAGES} images.`,
      //       function (images) {
      //         const { existingImages } = this.options.context;
      //         const total =
      //           (images?.length || 0) + (existingImages?.length || 0);
      //         return total >= 1 && total <= MAX_IMAGES;
      //       }
      //     ),
      //   otherwise: (schema) => schema.notRequired(),
      // }),
      content: Yup.string().when("blogType", {
        is: "content",
        then: (schema) => schema.required("Content is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      link: Yup.string().when("blogType", {
        is: "link",
        then: (schema) =>
          schema.url("Invalid URL format").required("Link is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    context: { existingImages },
    onSubmit: async (values) => {
      // Check if the form data is different from the initial data
      // if (JSON.stringify(values) === JSON.stringify(initialData)) {
      //   // If no changes, do not submit
      //   toast.info("No changes detected");
      //   return;
      // }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("blogType", values.blogType);
      formData.append("imageSize", values.imageSize);

      if (values.blogType === "file" && values.file) {
        formData.append("file", values.file);
      }

      if (values.blogType === "images") {
        values.images.forEach((img) => formData.append("images", img));
        existingImages.forEach((img) => formData.append("existingImages", img));
      }

      if (values.blogType === "content") {
        formData.append("content", values.content);
      }
      if (values.blogType === "link" && values.link) {
        formData.append("link", values.link);
      }

      try {
        await updateBlog(blog._id, formData); // Update blog API call
        toast.success("Blog updated!");
        onClose();
        window.location.reload();
      } catch (err) {
        toast.error("Error updating blog");
        console.error(err);
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("file", file);
      setFilePreview(file.name);
    } else {
      formik.setFieldValue("file", null);
      setFilePreview(null);
    }
  };

  const handleImagesChange = (event) => {
    const files = Array.from(event.target.files);
    const total =
      existingImages.length + formik.values.images.length + files.length;

    if (total > MAX_IMAGES) {
      toast.error(`Max ${MAX_IMAGES} images allowed`);
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    formik.setFieldValue("images", [...formik.values.images, ...files]);
  };

  const handleRemoveImage = (index) => {
    if (index < existingImages.length) {
      const updated = [...existingImages];
      updated.splice(index, 1);
      setExistingImages(updated);
    } else {
      const adjustedIndex = index - existingImages.length;
      const updatedFiles = [...formik.values.images];
      updatedFiles.splice(adjustedIndex, 1);
      formik.setFieldValue("images", updatedFiles);
    }

    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center transition-opacity duration-300">
      <div className="bg-white w-full max-w-4xl h-[90vh] sm:rounded-xl overflow-y-auto transform transition-all duration-300 ease-out animate-fadeInUp">
        <div className="sticky top-0 bg-white z-10 p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Blog</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl font-bold"
          >
            &times;
          </button>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="p-6 space-y-4 overflow-y-auto"
        >
          <input
            type="hidden"
            name="imageChangeTracker"
            value={formik.values.images.length + existingImages.length}
          />

          <div>
            <label className="block font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {formik.values.blogType === "content" && (
            <div>
              <label className="block font-medium">Content</label>
              <textarea
                name="content"
                value={formik.values.content}
                onChange={formik.handleChange}
                rows="8"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          )}

          {formik.values.blogType === "file" && (
            <div>
              <label className="block font-medium">Upload File</label>
              <input type="file" onChange={handleFileChange} />
              {filePreview && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <IoMdDocument className="text-lg text-blue-500" />
                  <span>{filePreview}</span>
                </div>
              )}
            </div>
          )}

          {formik.values.blogType === "images" && (
            <div>
              <label className="block font-medium">Image Size</label>
              <select
                name="imageSize"
                value={formik.values.imageSize}
                onChange={formik.handleChange}
                className="mb-3 w-full border rounded px-3 py-2"
              >
                <option value="square">Square (1:1)</option>
                <option value="sixByNine">Portrait (16:9)</option>
              </select>

              <label className="block font-medium">Upload Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImagesChange}
              />

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                {imagePreviews.map((src, i) => (
                  <div
                    key={i}
                    className={`relative overflow-hidden rounded border bg-gray-100 ${
                      formik.values.imageSize === "square"
                        ? "aspect-square"
                        : "aspect-[2/3]"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`preview-${i}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 right-1 bg-white bg-opacity-80 text-red-500 rounded-full p-1 shadow hover:text-red-700"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {formik.values.blogType === "link" && (
            <div>
              <label className="block font-medium">Link</label>
              <input
                type="url"
                name="link"
                value={formik.values.link}
                onChange={formik.handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="https://example.com"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-6 px-4 py-2 bg-base-color text-white font-medium rounded hover:bg-green-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

EditModal.propTypes = {
  blog: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    content: PropTypes.string,
    blogType: PropTypes.oneOf(["content", "file", "images"]),
    imageSize: PropTypes.string,
    files: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    link: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

const BlogCard = ({ blog, onPublishToggle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // State and Handlers
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrevious = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 2000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  if (!blog) return null;

  const {
    _id,
    title,
    description,
    blogType,
    content,
    files,
    images,
    createdAt,
    published,
  } = blog;

  const handlePublishChange = async (event) => {
    const newPublishedStatus = event.target.checked;

    if (!blog?._id) return;

    setIsUpdating(true);
    try {
      await onPublishToggle(blog._id, newPublishedStatus, event);
    } finally {
      setIsUpdating(false);
    }
  };

  const renderCardContent = () => {
    switch (blogType) {
      case "content":
        return (
          <div className="mt-3 text-gray-600 text-sm">
            <p>{truncateText(content, 150)}</p>
            {/* <a
              href={`/blogs/${_id}`}
              className="text-indigo-600 hover:underline mt-2 inline-block"
            >
              Read More
            </a> */}
          </div>
        );
      case "file":
        return (
          <div className="mt-3">
            {files && (
              <a
                href={`https://api.ctrl-club.com${files}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition duration-150 ease-in-out text-sm"
              >
                <IoMdDocument className="text-lg" />
                <span>Download File</span>
              </a>
            )}
            {!files && (
              <p className="text-sm text-red-500">File data missing.</p>
            )}
          </div>
        );
      case "images":
        return (
          <div className="mt-3 relative">
            {images && images.length > 0 ? (
              <>
                {/* Main Carousel */}
                <div className="relative">
                  <img
                    src={`https://api.ctrl-club.com${images[activeIndex]}`}
                    alt={`Blog image ${activeIndex + 1}`}
                    className="w-full h-64 object-cover rounded border border-gray-200"
                  />
                  <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  {/* Image counter */}
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {activeIndex + 1} / {images.length}
                  </div>
                </div>

                {/* Thumbnails */}
                {/* {images.length > 1 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`rounded overflow-hidden border-2 transition-all ${
                          index === activeIndex
                            ? "border-purple-500 opacity-100"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={`https://api.ctrl-club.com${image}`}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-16 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )} */}
              </>
            ) : (
              <p className="text-sm text-gray-500">No images found.</p>
            )}
          </div>
        );
      case "link":
        return (
          <div className="mt-3">
            {blog.link && (
              <a
                href={blog.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition duration-150 ease-in-out text-sm"
              >
                <IoMdDocument className="text-lg" />
                <span>Open Link</span>
              </a>
            )}
            {!blog.link && (
              <p className="text-sm text-red-500">Link is missing.</p>
            )}
          </div>
        );

      default:
        return <p className="text-sm text-red-500 mt-3">Unknown blog type.</p>;
    }
  };

  const getTypeBadge = () => {
    switch (blogType) {
      case "content":
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded border border-green-400">
            Content
          </span>
        );
      case "file":
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-400">
            File
          </span>
        );
      case "images":
        return (
          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded border border-purple-400">
            Images
          </span>
        );
      case "link":
        return (
          <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded border border-teal-400">
            Link
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col justify-between p-5 hover:shadow-md transition-shadow duration-200">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <input
            type="checkbox"
            id={`publish-checkbox-${_id}`}
            className="h-5 w-5 text-base-color border-gray-300 rounded focus:ring-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            checked={!!published}
            onChange={handlePublishChange}
            disabled={isUpdating}
            aria-label={`Publish status for ${title}`}
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Edit blog"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-gray-500 hover:text-red-600"
            aria-label="Delete blog"
          >
            <FaTrashAlt />
          </button>
        </div>
        <div className="pl-8 pr-8 mt-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {title}
            </h3>
            {getTypeBadge()}
          </div>
          <p className="text-gray-600 text-sm mb-3">{description}</p>
          {renderCardContent()}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <IoMdTime />
            <span>
              {createdAt
                ? `${formatDistanceToNow(new Date(createdAt))} ago`
                : "Date unavailable"}
            </span>
          </div>
        </div>
        {isModalOpen && (
          <EditModal blog={blog} onClose={() => setIsModalOpen(false)} />
        )}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this blog? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  async function handleDelete() {
    try {
      const response = await fetch(
        `https://api.ctrl-club.com/api/blogs/blog/${_id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        toast.success("Blog deleted successfully!");
        setShowDeleteModal(false);
        window.location.reload();
        // Optionally, trigger a refresh or remove the blog from the UI
      } else {
        toast.error("Failed to delete the blog.");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("An error occurred while deleting the blog.");
    }
  }
};

BlogCard.propTypes = {
  blog: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    blogType: PropTypes.string,
    content: PropTypes.string,
    files: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    createdAt: PropTypes.string,
    published: PropTypes.bool,
  }),
};

BlogCard.propTypes = {
  blog: PropTypes.object,
  onPublishToggle: PropTypes.func,
};

export default BlogCard;
