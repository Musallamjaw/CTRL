import axiosInstance from "../axios";


export const sendContactForm = (contactData) => {
  return axiosInstance.post(`/contact`, contactData);
}