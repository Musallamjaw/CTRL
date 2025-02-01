import axiosInstance from "../axios";

export const logIn = (loginData) => {
  return axiosInstance.post('/auth/logIn', loginData, {
    withCredentials: true
  });;
}

export const logOut = () => {
  return axiosInstance.post('/auth/logOut', {}, {
    withCredentials: true
  });
}

export const signUp = (signUpData) => {
  return axiosInstance.post('/auth/signUp', signUpData, {
    withCredentials: true
  });
}

export const verifyCode = (verificationData) => {
  return axiosInstance.post('/auth/verifyCode', verificationData, {
    withCredentials: true
  });
}

export const refresh = () => {
  return axiosInstance.post('/auth/refresh', {}, {
    withCredentials: true
  });
}

export const sendForgotPasswordEmail = (emailData) => {
  const email = emailData.email
  return axiosInstance.post('/auth/forgotPassword', { email }, {
    withCredentials: true
  });
}

export const sendResetPasswordRequest = (token, passwordData) => {
  const password = passwordData.newPassword
  return axiosInstance.post('/auth/resetPassword', { token, password }, {
    withCredentials: true
  });
};