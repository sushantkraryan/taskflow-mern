import axios from "axios";

// One shared axios instance, pre-configured with the backend base URL.
// Every request we make will go through this.
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// This is an axios "interceptor" — it runs before EVERY request goes out.
// We read the JWT from localStorage and attach it as a header, so we
// don't have to manually add it every time we call the API.
// Conceptually similar to how a browser automatically attaches a
// session cookie — except here we're doing it explicitly for JWT.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
