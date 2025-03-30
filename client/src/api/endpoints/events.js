import axiosInstance from "../axios";

export const createEvent = (formData) => {
  // Ensure eventType is properly included
  if (!formData.get("eventType")) {
    formData.append("eventType", "in-person"); // Default value
  }

  return axiosInstance.post(`/events`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllEvents = (page, filter, eventType = null) => {
  const url = `/events/all/${page}/${filter}${
    eventType ? `?eventType=${eventType}` : ""
  }`;
  return axiosInstance.get(url);
};

export const getAllEventsForScanner = () => {
  return axiosInstance.get(`/events/getEventsForScanner`);
};

export const getCountEvents = (filter, eventType = null) => {
  const url = `/events/count/${filter}${
    eventType ? `?eventType=${eventType}` : ""
  }`;
  return axiosInstance.get(url);
};

export const getEventById = (eventId) => {
  return axiosInstance.get(`/events/${eventId}`);
};

export const updateEvent = (eventId, formData) => {
  // Ensure eventType is maintained during updates
  if (formData instanceof FormData && !formData.get("eventType")) {
    formData.append("eventType", "in-person");
  }

  return axiosInstance.put(`/events/update/${eventId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteEvent = (eventId) => {
  return axiosInstance.delete(`/events/delete/${eventId}`);
};

export const getClosestEvent = (eventType = null) => {
  const url = `/events/closestEvent${
    eventType ? `?eventType=${eventType}` : ""
  }`;
  return axiosInstance.get(url);
};

// New helper function to build proper FormData for events
export const buildEventFormData = (eventData) => {
  const formData = new FormData();

  // Append all standard fields
  formData.append("title", eventData.title);
  formData.append("description", eventData.description);
  formData.append("date", eventData.date);
  formData.append("price", eventData.price);
  formData.append("capacity", eventData.capacity);
  formData.append("eventType", eventData.eventType || "in-person");

  // Conditional fields
  if (eventData.eventType === "in-person") {
    formData.append("location", eventData.location);
  } else {
    formData.append("meetingLink", eventData.meetingLink);
  }

  // Append cover image if exists
  if (eventData.coverImage instanceof File) {
    formData.append("coverImage", eventData.coverImage);
  }

  return formData;
};
