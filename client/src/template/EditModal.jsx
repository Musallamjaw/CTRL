import { useFormik } from "formik";
import * as Yup from "yup";
import { IoMdCloudUpload, IoMdDocument, IoMdImage } from "react-icons/io";
import { updateBlog } from "../api/endpoints/blogs";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { useState } from "react";

const MAX_IMAGES = 10;

const EditModal = ({ blog, onClose }) => {
  const [imagePreviews, setImagePreviews] = useState(
    blog.blogType === "images"
      ? blog.images.map((img) => `https://api.ctrl-club.com${img}`)
      : []
  );
  const [filePreview, setFilePreview] = useState(
    blog.blogType === "file" ? blog.files?.split("/").pop() : null
  );

  const formik = useFormik({
    initialValues: {
      title: blog.title || "",
      description: blog.description || "",
      content: blog.content || "",
      file: null,
      images: [],
      blogType: blog.blogType || "content",
      imageSize: blog.imageSize || "square",
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
      images: Yup.array().when("blogType", {
        is: "images",
        then: (schema) =>
          schema
            .min(1, "At least one image is required")
            .max(MAX_IMAGES, `Max ${MAX_IMAGES} images allowed`),
        otherwise: (schema) => schema.notRequired(),
      }),
      content: Yup.string().when("blogType", {
        is: "content",
        then: (schema) => schema.required("Content is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("blogType", values.blogType);
      formData.append("imageSize", values.imageSize);

      if (values.blogType === "file" && values.file) {
        formData.append("file", values.file);
      }

      if (values.blogType === "images" && values.images.length > 0) {
        values.images.forEach((img) => formData.append("images", img));
      }

      if (values.blogType === "content") {
        formData.append("content", values.content);
      }

      try {
        await updateBlog(blog._id, formData);
        toast.success("Blog updated!");
        onClose();
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
    if (files.length > MAX_IMAGES) {
      toast.error(`Max ${MAX_IMAGES} images allowed`);
      return;
    }

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    formik.setFieldValue("images", files);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md w-full max-w-2xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Blog</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
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
                className="w-full border rounded px-3 py-2"
                rows="6"
              />
            </div>
          )}

          {formik.values.blogType === "file" && (
            <div>
              <label className="block font-medium">File</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="block mt-1"
              />
              {filePreview && (
                <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                  <IoMdDocument className="text-lg text-blue-500" />
                  <span>{filePreview}</span>
                </div>
              )}
            </div>
          )}

          {formik.values.blogType === "images" && (
            <div>
              <label className="block font-medium mb-1">Image Size</label>
              <select
                name="imageSize"
                value={formik.values.imageSize}
                onChange={formik.handleChange}
                className="mb-3 w-full border rounded px-3 py-2"
              >
                <option value="square">Square (1:1)</option>
                <option value="sixByNine">Portrait (16:9)</option>
              </select>

              <label className="block font-medium">Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImagesChange}
              />
              <div className="grid grid-cols-3 gap-2 mt-3">
                {imagePreviews.map((src, i) => (
                  <div
                    key={i}
                    className={`w-full border rounded overflow-hidden bg-gray-100 ${
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
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
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
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditModal;
