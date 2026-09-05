import { apiClient } from "@/shared/api/api-client";
import type {
  CreateFolderRequest,
  CreateUploadUrl,
  CreateUploadUrlRequest,
  ListResourcesQuery,
  ListTrashQuery,
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
  query: ListResourcesQuery,
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

export async function listTrashAsync(
  query: ListTrashQuery,
): Promise<Array<Resource>> {
  return apiClient.get(`${baseUrl}/trash`, {
    params: query,
  });
}

export async function softDeleteResourceAsync(id: string): Promise<void> {
  return apiClient.delete(`${baseUrl}/${id}`);
}

export async function restoreResourceAsync(id: string): Promise<void> {
  return apiClient.post(`${baseUrl}/${id}/restore`);
}
