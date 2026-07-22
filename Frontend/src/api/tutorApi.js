import api from "./axios";

export const getTutorProfile = async () => {
  const response = await api.get("/tutors/profile");
  return response.data;
};

export const createTutorProfile = async (data) => {
  const response = await api.post("/tutors/create", data);
  return response.data;
};

export const updateTutorProfile = async (data) => {
  const response = await api.put("/tutors/profile", data);
  return response.data;
};

export const getTutorRequests = async (params = {}) => {
  const response = await api.get("/requests/tutor", { params });
  return response.data;
};

export const updateRequestStatus = async (requestId, status) => {
  const response = await api.put(`/requests/${requestId}/status`, { status });
  return response.data;
};

export const getTutorSessions = async (params = {}) => {
  const response = await api.get("/sessions/tutor", { params });
  return response.data;
};

export const completeSession = async (sessionId) => {
  const response = await api.put(`/sessions/${sessionId}/complete`);
  return response.data;
};

export const cancelSession = async (sessionId) => {
  const response = await api.put(`/sessions/${sessionId}/cancel`);
  return response.data;
};

export const getTutorDashboard = async () => {
  const response = await api.get("/tutor/dashboard");
  return response.data;
};

export const getTutorReviews = async () => {
  const response = await api.get("/tutors/reviews");
  return response.data;
};

// Availability slots
export const addAvailabilitySlot = async (slotData) => {
  const response = await api.post("/tutors/availability", slotData);
  return response.data;
};

export const deleteAvailabilitySlot = async (slotId) => {
  const response = await api.delete(`/tutors/availability/${slotId}`);
  return response.data;
};

// Verification
export const submitVerification = async (formData) => {
  const response = await api.post("/tutors/verify", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};