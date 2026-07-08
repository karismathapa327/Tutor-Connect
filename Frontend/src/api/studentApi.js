import api from "./axios";

export const getTutors = async () => {
  const response = await api.get("/tutors");
  return response.data;
};

export const getSessions = async () => {
  const response = await api.get("/sessions");
  return response.data;
};

export const getRequests = async () => {
  const response = await api.get("/requests");
  return response.data;
};

export const getTutorById = async (id) => {
  const response = await api.get(`/tutors/${id}`);
  return response.data;
};