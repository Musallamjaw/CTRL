import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { sendResetPasswordRequest } from '../../api/endpoints/auth';

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const initialValues = {
    newPassword: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const callResetPassword = async (passwordData) => {
    try {
      const response = await sendResetPasswordRequest(token, passwordData); // Send token and password data
      if (response.data.success) {
        return response;
      } else {
        return { error: response.data.message || 'Password reset failed' };
      }
    } catch (error) {
      return { error: error.message };
    }
  };

  const handleSubmit = async (values) => {
    const response = await callResetPassword(values);
    if (response.error) {
      toast.error(response.error || 'Error resetting password. Please try again.');
    } else {
      toast.success('Password reset successfully.');
      navigate('/login');
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ getFieldProps, isSubmitting }) => (
        <Form className="mt-6 flex flex-col gap-6">
          <div>
            <label className="block mb-2 font-medium">New Password</label>
            <input
              type="password"
              placeholder="Enter your new password"
              className="w-full min-h-12 p-3 pl-5 border rounded-md focus:outline-none focus:ring-2 focus:ring-base-color"
              {...getFieldProps('newPassword')}
            />
            <ErrorMessage
              name="newPassword"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your new password"
              className="w-full min-h-12 p-3 pl-5 border rounded-md focus:outline-none focus:ring-2 focus:ring-base-color"
              {...getFieldProps('confirmPassword')}
            />
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-base-color text-white py-3 font-semibold rounded-md hover:bg-second-color transition-all duration-300"
          >
            Reset Password
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ResetPasswordForm;
