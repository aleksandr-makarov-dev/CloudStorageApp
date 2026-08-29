import Axios from "axios";

export const apiClient = Axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});

console.log("axios.baseURL:", apiClient.defaults.baseURL);

apiClient.interceptors.request.use((request) => {
  if (request.headers) {
    request.headers.Accept = "application/json";
  }

  request.withCredentials = true;

  return request;
});

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;

    console.error("axios:", message);

    return Promise.reject(error);
  },
);
