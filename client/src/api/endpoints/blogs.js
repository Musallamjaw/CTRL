import axiosInstance from "../axios";

export const createBlog = (formData) => {
  return axiosInstance.post(`/blogs/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllBlogs = (page, filter) => {
  const url = `/blogs/all/${page}/${filter}`;
  return axiosInstance.get(url);
};

export const publishBlog = (blogId) => {
  const url = `/blogs/publish/${blogId}`;
  return axiosInstance.put(url);
};

export const getPublishedBlogs = () => {
  const url = `/blogs/published`;
  return axiosInstance.get(url);
};

export const getBlogById = (blogId) => {
  const url = `/blogs/blogById/${blogId}`;
  return axiosInstance.get(url);
};

export const updateBlog = (blogId, formData) => {
  return axiosInstance.post(`/blogs/update/${blogId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
