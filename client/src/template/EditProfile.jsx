import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../api/endpoints/users';
import { toast } from 'react-toastify';
import { logOut } from '../api/endpoints/auth';
import { deleteAuthData } from '../features/authData/authDataSlice';

const EditProfile = () => {
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.authData);

  const formik = useFormik({
    initialValues: {
      name: authData.userData.name,
      email: authData.userData.email,
    },
    onSubmit: (values) => {
      updateUser(authData.userData.id, values)
        .then(response => {
          logOut()
          dispatch(deleteAuthData());
          toast.success('Profile updated successfully:', response.data);
        })
        .catch(error => {
          toast.error('Error updating profile:', error);
        });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="p-6 mx-auto bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700">User Name</label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.name}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700">Email</label>
        <input
          id="email"
          name="email"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.email}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>

      <button type="submit" className="bg-base-color hover:bg-second-color text-white py-2 px-4 rounded-md transition-all duration-300">
        Update Profile
      </button>
    </form>
  );
};

export default EditProfile;
