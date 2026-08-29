import { axios } from "../lib/axios";
import type { CreateUploadUrlRequest } from "../models/create-upload-url-request";
import type { CreateUploadUrlResponse } from "../models/create-upload-url-response";

export async function createUploadUrlAsync(
  request: CreateUploadUrlRequest,
): Promise<CreateUploadUrlResponse> {
  return axios.post("/api/v1/resouces/upload-url", request);
}
