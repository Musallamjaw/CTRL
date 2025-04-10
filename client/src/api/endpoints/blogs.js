import axiosInstance from "../axios";

export const createBlog = (formData) => {
  return axiosInstance.post(`/blogs/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
