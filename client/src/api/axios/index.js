import axios from "axios";
import { store } from '../../app/store';
//const baseURL = import.meta.env.FRONTEND_BASE_URL

const axiosInstance = axios.create({
  baseURL: 'https://ctrl-web-l4h2.onrender.com',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState(); // Access Redux state directly
    const accessToken = state.authData?.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  }, function (error) {

    return Promise.reject(error);
  });

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        // Handle token expiration
        window.location = "/login";
      } else if (status === 400) {
        // Handle bad requests
        return Promise.reject(error);
      } else if (status === 500) {
        // Handle server errors
        window.location = "/server-error";
      }
    } else if (error.request) {
      // Handle network errors
      alert("Network error. Please check your connection.");
    } else {
      // Handle other errors
      alert("An unexpected error occurred.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
