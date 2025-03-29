import axios from 'axios';

export const createEvent = async (formData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    const response = await axios.post(`${API_URL}/create`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    return {
      error: error.response?.data?.message || 'Failed to create event',
    };
  }
};

// Get all events with pagination and filtering
export const getAllEvents = (page = 1, filter = 'all') => {
  return axiosInstance.get(`/events/all/${page}/${filter}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

// Get events for scanner (recent and upcoming)
export const getAllEventsForScanner = () => {
  return axiosInstance.get(`/events/getEventsForScanner`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

// Get count of events by filter
export const getCountEvents = (filter = 'all') => {
  return axiosInstance.get(`/events/count/${filter}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

// Get single event by ID
export const getEventById = (eventId) => {
  return axiosInstance.get(`/events/${eventId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

// Update existing event
export const updateEvent = async (eventId, formData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    const response = await axios.put(`${API_URL}/update/${eventId}`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    return {
      error: error.response?.data?.message || 'Failed to update event',
    };
  }
};

// Delete an event
export const deleteEvent = (eventId) => {
  return axiosInstance.delete(`/events/delete/${eventId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

// Get closest upcoming event
export const getClosestEvent = () => {
  return axiosInstance.get(`/events/closestEvent`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

// Additional utility functions
export const registerForEvent = async (eventId, userId) => {
  try {
    const response = await axiosInstance.post(`/events/register`, {
      eventId,
      userId
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error registering for event:', error);
    return {
      error: error.response?.data?.message || 'Failed to register for event',
    };
  }
};

export const checkRegistration = async (eventId, userId) => {
  try {
    const response = await axiosInstance.get(`/events/check-registration/${eventId}/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error checking registration:', error);
    return {
      error: error.response?.data?.message || 'Failed to check registration',
    };
  }
};
