import Axios, { AxiosError, isAxiosError } from "axios";
import { ApiError } from "./api-error";
import type { ProblemDetails } from "./problem-details";

export const apiClient = Axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});

apiClient.interceptors.request.use((request) => {
  if (request.headers) {
    request.headers.Accept = "application/json";
  }
  request.withCredentials = true;
  return request;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error: unknown) => {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<ProblemDetails | string>;

      // Prefer ProblemDetails shape
      const data = axiosError.response?.data;

      if (
        data &&
        typeof data === "object" &&
        ("title" in data || "detail" in data || "status" in data)
      ) {
        const problem = data as ProblemDetails;
        // Ensure status is present
        if (!problem.status && axiosError.response?.status) {
          problem.status = axiosError.response.status;
        }
        return Promise.reject(new ApiError(problem));
      }

      // Fallback when the server didn't return ProblemDetails
      const status = axiosError.response?.status ?? 500;
      return Promise.reject(
        new ApiError({
          status,
          title: axiosError.response?.statusText || "Error",
          detail: typeof data === "string" ? data : axiosError.message,
        }),
      );
    }

    // Non-Axios errors
    return Promise.reject(
      error instanceof Error
        ? error
        : new ApiError({
            status: 500,
            title: "Unknown Error",
            detail: String(error),
          }),
    );
  },
);
