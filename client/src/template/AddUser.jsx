import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { addUserByAdmin } from '../api/endpoints/users';

const AddUser = () => {
  const callAddUser = async (userData) => {
    try {
      const response = await addUserByAdmin(userData);
      toast.success('Your data has been inserted successfully.');
      return response;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Add failed. Please try again.');
      return { error: "Add failed. Please try again." };
    }
  };

  // Formik with Yup validation
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
      phoneNumber: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
      role: Yup.string().oneOf(['user', 'admin', 'scanner'], 'Invalid user role').required('User role is required'),
      phoneNumber: Yup.string()
        .matches(/^\d+$/, 'Phone number must be digits only')
        .min(10, 'Phone number must be at least 10 digits')
        .required('Phone number is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      await callAddUser(values);
      setSubmitting(false);
    },
  });

  return (
    <div className="lg:col-span-3 w-full mx-auto bg-white rounded-lg lg:ml-6 border">
      <div className='p-6 border rounded-t-lg'>
        <h1 className='text-2xl font-semibold text-blue-900'>All Events</h1>
      </div>
      <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-4 mx-auto p-6">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm">{formik.errors.name}</div>
          )}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          )}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          )}
        </div>

        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="text-red-500 text-sm">{formik.errors.confirmPassword}</div>
          )}
        </div>

        <div>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${formik.touched.phoneNumber && formik.errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <div className="text-red-500 text-sm">{formik.errors.phoneNumber}</div>
          )}
        </div>

        <div>
          <select
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block w-full px-4 py-2 border ${formik.touched.role && formik.errors.role ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="scanner">Scanner</option>
          </select>
          {formik.touched.role && formik.errors.role && (
            <div className="text-red-500 text-sm">{formik.errors.role}</div>
          )}
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className={`px-4 py-2 text-white rounded-md transition-all duration-300 ${formik.isSubmitting ? 'bg-gray-400' : 'bg-base-color hover:bg-green-700'}`}
        >
          {formik.isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default AddUser;
