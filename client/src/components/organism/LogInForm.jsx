import { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RiEyeCloseFill } from 'react-icons/ri';
import { FaRegEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { saveAuthData } from '../../features/authData/authDataSlice';
import { logIn } from '../../api/endpoints/auth';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const callLogIn = async (loginData) => {
    try {
      const response = await logIn(loginData);
      if (response.data.success) {
        return response;
      } else {
        return { error: response.data.message || 'Login failed' };
      }

    } catch (error) {
      return { error: error };
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const initialValues = {
    email: '',
    password: '',
    rememberMe: false,
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleSubmit = async (values) => {
    const response = await callLogIn(values);
    if (response.error) {
      toast.error(response.error || 'Login failed. Please try again.');
    } else {
      toast.success(response.data.message);
      dispatch(saveAuthData({
        accessToken: response.data.accessToken,
        userData: response.data.userData,
      }));
      navigate('/');
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
          <div>
            <label className="block mt-4 mb-2 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full p-3 pl-5 min-h-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-base-color"
                {...getFieldProps('password')}
              />
              <button
                type="button"
                className="absolute right-2 top-2 w-10 h-10 text-2xl text-base-color"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaRegEye /> : <RiEyeCloseFill />}
              </button>
            </div>
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div className="flex flex-col xmobile:flex-row xmobile:justify-between items-start gap-7 mt-4">
            <Link
              to='/signUp'
              className="text-sm text-base-color font-bold hover:underline hover:text-blue-500"
            >
              Create Account
            </Link>
            <Link
              to='/logIn/forgot-password'
              className="text-sm text-black font-bold hover:underline hover:text-base-color"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-base-color text-white py-3 font-semibold rounded-md hover:bg-second-color transition-all duration-300"
          >
            Sign In
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
