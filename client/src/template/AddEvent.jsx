import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoMdCloudUpload } from 'react-icons/io';
import { createEvent } from '../api/endpoints/events';
import { toast } from 'react-toastify';

const AddEvent = () => {
  const [coverImagePreview, setCoverImagePreview] = useState('');

  const callAddEvent = async (eventData) => {
    try {
      const response = await createEvent(eventData);
      toast.success('Your data has been inserted successfully.');
      return response;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Add Event failed. Please try again.');
      return { error: "Add Event failed. Please try again." };
    }
  }

  // Formik with Yup validation
  const formik = useFormik({
    initialValues: {
      coverImage: null,
      title: '',
      price: '',
      date: '',
      description: '',
      location: '',
      capacity: '',
    },
    validationSchema: Yup.object({
      coverImage: Yup.mixed().required('Course cover image is required'),
      title: Yup.string().required('Course title is required'),
      price: Yup.number().required('Price is required').typeError('Price must be a number'),
      date: Yup.date().required('Date is required').typeError('Date must be a valid date'),
      description: Yup.string().required('Description is required'),
      location: Yup.string().required('Location is required'),
      capacity: Yup.number().required('Capacity is required').typeError('Capacity must be a number'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await callAddEvent(values);
      resetForm();
      setSubmitting(false);
    },
  });

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue('coverImage', file);

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
      <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-4 mx-auto">
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
            <div className="text-red-500 text-sm">{formik.errors.coverImage}</div>
          ) : null}
          <p className="text-gray-500 mt-2">PNG or JPG no bigger than 800px width and height</p>
        </div>

        <div>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${formik.touched.title && formik.errors.title ? 'border-red-500' : 'border-gray-300'
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
            placeholder="Event Price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${formik.touched.price && formik.errors.price ? 'border-red-500' : 'border-gray-300'
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
            placeholder="Event Date and Time"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${formik.touched.date && formik.errors.date ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {formik.touched.date && formik.errors.date ? (
            <div className="text-red-500 text-sm">{formik.errors.date}</div>
          ) : null}
        </div>

        <div>
          <textarea
            name="description"
            placeholder="Event Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${formik.touched.description && formik.errors.description
              ? 'border-red-500'
              : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="text-red-500 text-sm">{formik.errors.description}</div>
          ) : null}
        </div>

        <div>
          <input
            type="text"
            name="location"
            placeholder="Event Location"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${formik.touched.location && formik.errors.location ? 'border-red-500' : 'border-gray-300'
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
            className={`block w-full px-4 py-2 border ${formik.touched.capacity && formik.errors.capacity ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {formik.touched.capacity && formik.errors.capacity ? (
            <div className="text-red-500 text-sm">{formik.errors.capacity}</div>
          ) : null}
        </div>

        <button type="submit" className="px-4 py-2 bg-base-color text-white rounded-md hover:bg-green-700">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddEvent;
