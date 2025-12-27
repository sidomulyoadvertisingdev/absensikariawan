import axios from "axios";

const api = axios.create({
  baseURL: "https://admin.sidomulyoproject.com/api",
  headers: {
    Accept: "application/json",
  },
});

// 👉 otomatis kirim token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 👉 auto logout jika token expired
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
