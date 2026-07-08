import api from "./axios";

export const getTutors = async () => {
  const response = await api.get("/tutors");
  return response.data;
};

export const getSessions = async () => {
  const response = await api.get("/sessions/student");
  return response.data;
};

export const getRequests = async () => {
    const response = await api.get("/requests/student");
    return response.data;
};

export const getTutorById = async (id) => {
  const response = await api.get(`/tutors/${id}`);
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

