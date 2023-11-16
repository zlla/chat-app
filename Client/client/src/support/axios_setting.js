import axios from "axios";

const token = localStorage.getItem("accessToken");
const apiUrl = "http://localhost:5255";

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const getData = async (apiRoute) => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/${apiRoute}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export { axiosInstance, apiUrl, getData };
