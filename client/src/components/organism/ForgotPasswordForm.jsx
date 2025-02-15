
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { sendForgotPasswordEmail } from '../../api/endpoints/auth';

const ForgotPasswordForm = () => {

  const initialValues = {
    email: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const callForgotPassword = async (emailData) => {
    try {
      const response = await sendForgotPasswordEmail(emailData);
      if (response.data.success) {
        return response;
      } else {
        return { error: response.data.message || 'Request failed' };
      }
    } catch (error) {
      return { error: error.message };
    }
  };

  const handleSubmit = async (values) => {
    const response = await callForgotPassword(values);
    if (response.error) {
      toast.error(response.error || 'Error sending reset email. Please try again.');
    } else {
      toast.success('Password reset link sent. Please check your email.');
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
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full min-h-12 p-3 pl-5 border rounded-md focus:outline-none focus:ring-2 focus:ring-base-color"
              {...getFieldProps('email')}
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-base-color text-white py-3 font-semibold rounded-md hover:bg-second-color transition-all duration-300"
          >
            Send Reset Link
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ForgotPasswordForm;
