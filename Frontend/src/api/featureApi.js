import api from "./axios";

// NOTIFICATIONS API
export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.patch("/notifications/read-all");
  return response.data;
};

// FAVORITES API
export const toggleFavoriteTutor = async (tutorId) => {
  const response = await api.post(`/favorites/${tutorId}`);
  return response.data;
};

export const getFavoriteTutors = async () => {
  const response = await api.get("/favorites");
  return response.data;
};

export const getFavoriteIds = async () => {
  const response = await api.get("/favorites/ids");
  return response.data;
};

// RESOURCES API
export const getResources = async (params = {}) => {
  const response = await api.get("/resources", { params });
  return response.data;
};

export const uploadResource = async (formData) => {
  const response = await api.post("/resources", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await api.delete(`/resources/${id}`);
  return response.data;
};

// PAYMENTS API
export const processPayment = async (paymentData) => {
  const response = await api.post("/payments/pay", paymentData);
  return response.data;
};

export const getMyPayments = async () => {
  const response = await api.get("/payments/my-payments");
  return response.data;
};

export const getAllPayments = async () => {
  const response = await api.get("/payments/admin/all");
  return response.data;
};

// MILESTONES API
export const getMyMilestones = async () => {
  const response = await api.get("/milestones");
  return response.data;
};

export const checkMilestones = async () => {
  const response = await api.post("/milestones/check");
  return response.data;
};
