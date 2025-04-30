/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoMdCloudUpload } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { updateEvent } from "../api/endpoints/events";

const EditEvent = ({ initialValues = {} }) => {
  const location = useLocation();
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const eventData = location.state?.eventData || {};
  const eventId = eventData.id;

  console.log(initialValues);

  useEffect(() => {
    if (eventData.coverImage) {
      setCoverImagePreview(
        `https://api.ctrl-club.com/uploads/eventsImage/${eventData.coverImage}`
      );
    }
  }, [eventData.coverImage]);

  // Formik with Yup validation and initial values from props
  const formik = useFormik({
    initialValues: {
      coverImage: eventData.coverImage || null,
      title: eventData.title || "",
      price: eventData.price || 0,
      date: eventData.date
        ? new Date(eventData.date).toISOString().substring(0, 16)
        : "", // Format date correctly
      description: eventData.description || "",
      location: eventData.location || "",
      capacity: eventData.capacity || "",
      availableTickets: eventData.availableTickets || "",
    },
    validationSchema: Yup.object({
      date: Yup.date()
        .required("Date is required")
        .typeError("Date must be a valid date"),
      // other validation rules
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true); // Disable the form while submitting
        const response = await updateEvent(eventId, values); // Call the API to update the event
        toast.success(response?.data.message || "Event updated successfully!");
      } catch (error) {
        toast.error("Failed to update event. Please try again.");
      } finally {
        setSubmitting(false); // Re-enable the form after the submission is done
      }
    },
  });

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("coverImage", file);

      // Update the cover image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="lg:col-span-3 w-full mx-auto p-6 bg-white rounded-lg lg:ml-6 border">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full flex flex-col gap-4 mx-auto"
      >
        <div className="mb-4 border-b pb-4">
          <label className="block text-gray-700">Course Cover Image</label>
          <div className="flex items-center space-x-4">
            {coverImagePreview && (
              <img
                src={coverImagePreview}
                alt="Cover Image Preview"
                className="max-w-96 rounded-lg my-4 object-cover border-4 border-base-color"
              />
            )}
            <label
              htmlFor="coverImage"
              className="cursor-pointer bg-base-color w-12 h-12 flex justify-center items-center hover:bg-second-color text-white rounded-md transition-all duration-300"
            >
              <IoMdCloudUpload className="text-2xl" />
            </label>
            <input
              id="coverImage"
              name="coverImage"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleCoverImageChange}
              className="hidden"
            />
          </div>
          {formik.touched.coverImage && formik.errors.coverImage ? (
            <div className="text-red-500 text-sm">
              {formik.errors.coverImage}
            </div>
          ) : null}
          <p className="text-gray-500 mt-2">
            PNG or JPG no bigger than 800px width and height
          </p>
        </div>

        <div>
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${
              formik.touched.title && formik.errors.title
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {formik.touched.title && formik.errors.title ? (
            <div className="text-red-500 text-sm">{formik.errors.title}</div>
          ) : null}
        </div>

        <div>
          <input
            type="text"
            name="price"
            placeholder="Course Price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${
              formik.touched.price && formik.errors.price
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {formik.touched.price && formik.errors.price ? (
            <div className="text-red-500 text-sm">{formik.errors.price}</div>
          ) : null}
        </div>

        <div>
          <input
            type="datetime-local"
            name="date"
            placeholder="Course Date and Time"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${
              formik.touched.date && formik.errors.date
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {formik.touched.date && formik.errors.date ? (
            <div className="text-red-500 text-sm">{formik.errors.date}</div>
          ) : null}
        </div>

        <div>
          <textarea
            name="description"
            placeholder="Course Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${
              formik.touched.description && formik.errors.description
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="text-red-500 text-sm">
              {formik.errors.description}
            </div>
          ) : null}
        </div>

        <div>
          <input
            type="text"
            name="location"
            placeholder="Course Location"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${
              formik.touched.location && formik.errors.location
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {formik.touched.location && formik.errors.location ? (
            <div className="text-red-500 text-sm">{formik.errors.location}</div>
          ) : null}
        </div>

        <div>
          <input
            type="number"
            name="capacity"
            placeholder="Event Capacity"
            value={formik.values.capacity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${
              formik.touched.capacity && formik.errors.capacity
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {formik.touched.capacity && formik.errors.capacity ? (
            <div className="text-red-500 text-sm">{formik.errors.capacity}</div>
          ) : null}
        </div>
        <div>
          <input
            type="number"
            name="availableTickets"
            placeholder="Available Tickets"
            value={formik.values.availableTickets}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${
              formik.touched.availableTickets && formik.errors.availableTickets
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {formik.touched.availableTickets && formik.errors.availableTickets ? (
            <div className="text-red-500 text-sm">
              {formik.errors.availableTickets}
            </div>
          ) : null}
        </div>

        <div>
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-all duration-300"
            disabled={formik.isSubmitting} // Disable button while submitting
          >
            {formik.isSubmitting ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;
