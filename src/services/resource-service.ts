import { apiClient } from "../lib/api-client";
import type { CreateUploadUrlRequest } from "../models/create-upload-url-request";
import type { CreateUploadUrlResponse } from "../models/create-upload-url-response";

const baseUrl = "/api/v1/resources";

export async function createUploadUrlAsync(
  request: CreateUploadUrlRequest,
): Promise<CreateUploadUrlResponse> {
  return apiClient.post(`${baseUrl}/upload-url`, request);
}

export async function completeUploadAsync(resourceId: string): Promise<void> {
  return apiClient.put(`${baseUrl}/${resourceId}/complete-upload`);
}
