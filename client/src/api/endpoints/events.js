import axiosInstance from "../axios";

export const createEvent = (formData) => {
  return axiosInstance.post(`/events`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getAllEvents = (page, filter) => {
  return axiosInstance.get(`/events/all/${page}/${filter}`);
}

export const getAllEventsForScanner = () => {
  return axiosInstance.get(`/events/getEventsForScanner`);
}

export const getCountEvents = (filter) => {
  return axiosInstance.get(`/events/count/${filter}`);
}

export const getEventById = (eventId) => {
  return axiosInstance.get(`/events/${eventId}`);
}

export const updateEvent = (eventId, newData) => {
  return axiosInstance.put(`/events/update/${eventId}`, newData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export const deleteEvent = (eventId) => {
  return axiosInstance.delete(`/events/delete/${eventId}`);
}

export const getClosestEvent = () => {
  return axiosInstance.get(`/events/closestEvent`);
}
