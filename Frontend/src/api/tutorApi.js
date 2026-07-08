import api from "./axios";

export const getTutorDashboard = async () => {
  const response = await api.get("/tutor/dashboard");
  return response.data;
};