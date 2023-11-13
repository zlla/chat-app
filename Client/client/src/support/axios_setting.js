import axios from "axios";

const token = localStorage.getItem("accessToken");
const apiUrl = "http://localhost:5255";

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export { axiosInstance, apiUrl };
