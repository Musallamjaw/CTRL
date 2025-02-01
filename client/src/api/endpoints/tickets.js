import axiosInstance from "../axios";

export const getCountTickets = (filter) => {
  return axiosInstance.get(`/tickets/count/${filter}`);
}

export const getCountUserTickets = (filter, userId) => {
  return axiosInstance.get(`/tickets/count/${filter}/${userId}`);
}

export const scanTicket = (qrId) => {
  return axiosInstance.post(`/tickets/scan`, { qrId });
}

export const createTicket = (ticketData) => {
  return axiosInstance.post(`/tickets/createTicket`, { ticketData });
}

export const getTicketsByUserId = (userId, page, filter) => {
  return axiosInstance.get(`/tickets/userTickets/${userId}/${page}/${filter}`);
};
