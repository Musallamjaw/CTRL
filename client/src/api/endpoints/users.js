import axiosInstance from "../axios";

export const getAllUsers = (page) => {
  return axiosInstance.get(`/user/all/${page}`);
}

export const getCountUsers = () => {
  return axiosInstance.get(`/user/count`);
}


export const getUserById = (userId) => {
  return axiosInstance.get(`/user/${userId}`);
}

export const addUserByAdmin = (userData) => {
  return axiosInstance.post(`/user/addUser`, userData);
}


export const updateUser = (userId, newData) => {
  return axiosInstance.put(`/user/${userId}`, newData);
};

export const deleteUser = (userId) => {
  return axiosInstance.delete(`/user/${userId}`);
}

