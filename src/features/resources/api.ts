import { apiClient } from "@/shared/api/api-client";
import type {
  CreateFolderRequest,
  CreateUploadUrl,
  CreateUploadUrlRequest,
  ListResourcesQueryParams,
  Resource,
  UpdateResourceRequest,
} from "./types";

const baseUrl = "/api/v1/resources";

export async function createUploadUrlAsync(
  request: CreateUploadUrlRequest,
): Promise<CreateUploadUrl> {
  return apiClient.post(`${baseUrl}/upload-url`, request);
}

export async function completeUploadAsync(
  resourceId: string,
): Promise<Resource> {
  return apiClient.put(`${baseUrl}/${resourceId}/complete-upload`);
}

export async function listResourcesAsync(
  query: ListResourcesQueryParams,
): Promise<Array<Resource>> {
  return apiClient.get(baseUrl, {
    params: query,
  });
}

export async function updateResourceAsync({
  id,
  request,
}: {
  id: string;
  request: UpdateResourceRequest;
}): Promise<Resource> {
  return apiClient.put(`${baseUrl}/${id}`, request);
}

export async function createFolderAsync(
  request: CreateFolderRequest,
): Promise<Resource> {
  return apiClient.post(`${baseUrl}/folder`, request);
}
