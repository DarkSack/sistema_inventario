import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PROJECT_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_APIKEY}`,
  },
});

export default axiosInstance;
