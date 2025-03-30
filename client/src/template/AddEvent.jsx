import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoMdCloudUpload } from "react-icons/io";
import { createEvent } from "../api/endpoints/events";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddEvent = () => {
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [eventType, setEventType] = useState("in-person");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("coverImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEventTypeChange = (e) => {
    const type = e.target.value;
    setEventType(type);
    formik.setFieldValue("eventType", type);
    if (type === "online") {
      formik.setFieldValue("location", "");
    } else {
      formik.setFieldValue("meetingLink", "");
    }
  };

  const formik = useFormik({
    initialValues: {
      coverImage: null,
      title: "",
      price: "",
      date: "",
      description: "",
      location: "",
      meetingLink: "",
      capacity: "",
      eventType: "in-person",
    },
    validationSchema: Yup.object({
      coverImage: Yup.mixed().required("Event cover image is required"),
      title: Yup.string().required("Event title is required"),
      price: Yup.number()
        .required("Price is required")
        .typeError("Price must be a number"),
      date: Yup.date()
        .required("Date is required")
        .typeError("Date must be a valid date"),
      description: Yup.string().required("Description is required"),
      // location: Yup.string().when("eventType", {
      //   is: "in-person",
      //   then: Yup.string().required(
      //     "Location is required for in-person events"
      //   ),
      // }),
      // meetingLink: Yup.string().when("eventType", {
      //   is: "online",
      //   then: Yup.string()
      //     .url("Must be a valid URL")
      //     .required("Meeting link is required for online events"),
      // }),
      capacity: Yup.number()
        .required("Capacity is required")
        .typeError("Capacity must be a number"),
      eventType: Yup.string().required("Event type is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("date", values.date);
        formData.append("price", values.price);
        formData.append("capacity", values.capacity);
        formData.append("eventType", values.eventType);

        if (values.eventType === "in-person") {
          formData.append("location", values.location);
        } else {
          formData.append("meetingLink", values.meetingLink);
        }

        if (values.coverImage) {
          formData.append("coverImage", values.coverImage);
        }

        const response = await createEvent(formData);

        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("Event created successfully!");
          resetForm();
          setCoverImagePreview("");
          navigate("/admin/events"); // Redirect to events list
        }
      } catch (error) {
        console.error("Submission error:", error);
        toast.error(error.response?.data?.message || "Failed to create event");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="lg:col-span-3 w-full mx-auto p-6 bg-white rounded-lg lg:ml-6 border">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full flex flex-col gap-4 mx-auto"
      >
        {/* Cover Image Upload */}
        <div className="mb-4 border-b pb-4">
          <label className="block text-gray-700">Event Cover Image</label>
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
        </div>

        {/* Event Type Selector */}
        <div>
          <label className="block text-gray-700 mb-2">Event Type</label>
          <select
            name="eventType"
            value={formik.values.eventType}
            onChange={handleEventTypeChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${
              formik.touched.eventType && formik.errors.eventType
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          >
            <option value="in-person">In-Person Event</option>
            <option value="online">Online Event</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${
              formik.touched.title && formik.errors.title
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-red-500 text-sm">{formik.errors.title}</div>
          )}
        </div>

        {/* Price */}
        <div>
          <input
            type="number"
            name="price"
            placeholder="Event Price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${
              formik.touched.price && formik.errors.price
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {formik.touched.price && formik.errors.price && (
            <div className="text-red-500 text-sm">{formik.errors.price}</div>
          )}
        </div>

        {/* Date */}
        <div>
          <input
            type="datetime-local"
            name="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${
              formik.touched.date && formik.errors.date
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {formik.touched.date && formik.errors.date && (
            <div className="text-red-500 text-sm">{formik.errors.date}</div>
          )}
        </div>

        {/* Description */}
        <div>
          <textarea
            name="description"
            placeholder="Event Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${
              formik.touched.description && formik.errors.description
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            rows="4"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 text-sm">
              {formik.errors.description}
            </div>
          )}
        </div>

        {/* Conditional Fields */}
        {eventType === "in-person" ? (
          <div>
            <input
              type="text"
              name="location"
              placeholder="Event Location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`block w-full px-4 py-2 border ${
                formik.touched.location && formik.errors.location
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {formik.touched.location && formik.errors.location && (
              <div className="text-red-500 text-sm">
                {formik.errors.location}
              </div>
            )}
          </div>
        ) : (
          <div>
            <input
              type="url"
              name="meetingLink"
              placeholder="Meeting Link (e.g., https://zoom.us/j/123456)"
              value={formik.values.meetingLink}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`block w-full px-4 py-2 border ${
                formik.touched.meetingLink && formik.errors.meetingLink
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {formik.touched.meetingLink && formik.errors.meetingLink && (
              <div className="text-red-500 text-sm">
                {formik.errors.meetingLink}
              </div>
            )}
          </div>
        )}

        {/* Capacity */}
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
          {formik.touched.capacity && formik.errors.capacity && (
            <div className="text-red-500 text-sm">{formik.errors.capacity}</div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 bg-base-color text-white rounded-md hover:bg-green-700 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Creating Event..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default AddEvent;
