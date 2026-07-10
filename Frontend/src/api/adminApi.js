import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getDashboardStats = () =>
  API.get("/statistics");

export const getUsers = () =>
  API.get("/users");

export const getTutors = () =>
  API.get("/tutors");

export const getSessions = () =>
  API.get("/sessions");

export const getReviews = () =>
  API.get("/reviews");

export const deleteUser = (id) =>
  API.delete(`/users/${id}`);