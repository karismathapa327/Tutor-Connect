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

export const getTutorRequests = async () => {
  const response = await api.get("/requests/tutor");
  return response.data;
};

export const updateRequestStatus = async (requestId, status) => {
  const response = await api.put(
    `/requests/${requestId}/status`,
    { status }
  );

  return response.data;
};

export const getTutorSessions = async () => {
  const response = await api.get("/sessions/tutor");
  return response.data;
};

export const completeSession = async (sessionId) => {
  const response = await api.put(
    `/sessions/${sessionId}/complete`
  );

  return response.data;
};

export const getTutorDashboard = async () => {
  const response = await api.get("/tutor/dashboard");
  return response.data;
};