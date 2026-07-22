import api from "./axios";

export const getDashboardStats = () => api.get("/admin/statistics");
export const getUsers = (params = {}) => api.get("/admin/users", { params });
export const getTutors = (params = {}) => api.get("/admin/tutors", { params });
export const getSessions = (params = {}) => api.get("/admin/sessions", { params });
export const getReviews = (params = {}) => api.get("/admin/reviews", { params });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

// Verification review API
export const getPendingVerifications = () => api.get("/admin/verifications");
export const updateVerificationStatus = (profileId, data) =>
  api.patch(`/admin/verifications/${profileId}`, data);