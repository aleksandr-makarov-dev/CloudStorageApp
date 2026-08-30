import { apiClient } from "../lib/api-client";
import type { CreateUploadUrlRequest } from "../models/create-upload-url-request";
import type { CreateUploadUrlResponse } from "../models/create-upload-url-response";
import type { ListResourcesQueryParams } from "../models/list-resources-query-params";
import type { ResourceResponse } from "../models/resource-response";

const baseUrl = "/api/v1/resources";

export async function createUploadUrlAsync(
  request: CreateUploadUrlRequest,
): Promise<CreateUploadUrlResponse> {
  return apiClient.post(`${baseUrl}/upload-url`, request);
}

export async function completeUploadAsync(resourceId: string): Promise<void> {
  return apiClient.put(`${baseUrl}/${resourceId}/complete-upload`);
}

export async function listResourcesAsync(
  query: ListResourcesQueryParams,
): Promise<Array<ResourceResponse>> {
  return apiClient.get(baseUrl, {
    params: query,
  });
}
