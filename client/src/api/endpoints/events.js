import axiosInstance from "../axios";

/**
 * Event API Service
 * Handles all event-related API calls
 */

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    console.error('API Error Response:', error.response.data);
    console.error('Status:', error.response.status);
    console.error('Headers:', error.response.headers);
    return {
      error: error.response.data?.message || 'Request failed',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API Request Error:', error.request);
    return {
      error: 'No response received from server',
      status: null
    };
  } else {
    // Something happened in setting up the request
    console.error('API Setup Error:', error.message);
    return {
      error: error.message || 'Request setup failed',
      status: null
    };
  }
};

/**
 * Create a new event
 * @param {FormData} formData - Event data including optional image file
 * @returns {Promise<Object>} - Response data or error
 */
export const createEvent = async (formData) => {
  try {
    const response = await axiosInstance.post('/events/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      timeout: 10000 // 10 seconds timeout
    });
    return { data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get all events with pagination and filtering
 * @param {number} page - Page number
 * @param {string} filter - Filter type ('all', 'open', 'closed')
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} - Response data or error
 */
export const getAllEvents = async (page = 1, filter = 'all', limit = 10) => {
  try {
    const response = await axiosInstance.get('/events/all', {
      params: { page, filter, limit },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return { data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get events for scanner (recent and upcoming)
 * @returns {Promise<Object>} - Response data or error
 */
export const getAllEventsForScanner = async () => {
  try {
    const response = await axiosInstance.get('/events/scanner', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return { data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get count of events by filter
 * @param {string} filter - Filter type ('all', 'open', 'closed')
 * @returns {Promise<Object>} - Response data or error
 */
export const getCountEvents = async (filter = 'all') => {
  try {
    const response = await axiosInstance.get(`/events/count/${filter}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return { data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get event by ID
 * @param {string} eventId - Event ID
 * @returns {Promise<Object>} - Response data or error
 */
export const getEventById = async (eventId) => {
  try {
    const response = await axiosInstance.get(`/events/${eventId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return { data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update an existing event
 * @param {string} eventId - Event ID
 * @param {FormData} formData - Updated event data including optional image file
 * @returns {Promise<Object>} - Response data or error
 */
export const updateEvent = async (eventId, formData) => {
  try {
    const response = await axiosInstance.put(`/events/update/${eventId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      timeout: 10000 // 10 seconds timeout
    });
    return { data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete an event
 * @param {string} eventId - Event ID
 * @returns {Promise<Object>} - Response data or error
 */
export const deleteEvent = async (eventId) => {
  try {
    const response = await axiosInstance.delete(`/events/delete/${eventId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return { data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get the closest upcoming event
 * @returns {Promise<Object>} - Response data or error
 */
export const getClosestEvent = async () => {
  try {
    const response = await axiosInstance.get('/events/closest', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return { data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

// Optional: Add more specific event-related API calls as needed
