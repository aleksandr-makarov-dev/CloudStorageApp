import Axios from "axios";

export const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axios.interceptors.request.use((request) => {
  if (request.headers) {
    request.headers.Accept = "application/json";
  }

  request.withCredentials = true;

  return request;
});

axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;

    console.error("axios:", message);

    return Promise.reject(error);
  },
);
