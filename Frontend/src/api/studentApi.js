import api from "./axios";

export const getTutors = async (params = {}) => {
  const response = await api.get("/tutors", { params });
  return response.data;
};

export const getSessions = async (params = {}) => {
  const response = await api.get("/sessions/student", { params });
  return response.data;
};

export const cancelSession = async (sessionId) => {
  const response = await api.put(`/sessions/${sessionId}/cancel`);
  return response.data;
};

export const getRequests = async (params = {}) => {
  const response = await api.get("/requests/student", { params });
  return response.data;
};

export const getTutorById = async (id) => {
  const response = await api.get(`/tutors/${id}`);
  return response.data;
};

export const getAvailableSlots = async (tutorId, date) => {
  const response = await api.get(`/tutors/${tutorId}/slots/available`, { params: { date } });
  return response.data;
};

export const createRequest = async (requestData) => {
  const response = await api.post("/requests", requestData);
  return response.data;
};

export const createReview = async (reviewData) => {
  const response = await api.post("/reviews", reviewData);
  return response.data;
};

export const getStudentDashboard = async () => {
  const response = await api.get("/student/dashboard");
  return response.data;
};

export const getSuggestedTutors = async (params = {}) => {
  const response = await api.get("/student/suggested-tutors", { params });
  return response.data;
};

export const getStudentProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put("/auth/change-password", passwordData);
  return response.data;
};
