import type { MutationConfig } from "@/shared/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import {
  completeUploadAsync,
  createFolderAsync,
  createUploadUrlAsync,
  getDownloadUrlAsync,
  restoreResourceAsync,
  softDeleteResourceAsync,
  updateResourceAsync,
} from "../api";
import { uploadToBucketAsync } from "../storage";

type UseUploadToBucketOptions = MutationConfig<typeof uploadToBucketAsync>;

export function useUploadToBucket(options?: UseUploadToBucketOptions) {
  return useMutation({
    ...options,
    mutationFn: uploadToBucketAsync,
  });
}

type UseCreateUploadUrlOptions = MutationConfig<typeof createUploadUrlAsync>;

export function useCreateUploadUrl(options?: UseCreateUploadUrlOptions) {
  return useMutation({ ...options, mutationFn: createUploadUrlAsync });
}

type UseCompleteUploadOptions = MutationConfig<typeof completeUploadAsync>;

export function useCompleteUpload(options?: UseCompleteUploadOptions) {
  return useMutation({ ...options, mutationFn: completeUploadAsync });
}

type UseUpdateResourceOptions = MutationConfig<typeof updateResourceAsync>;

export function useUpdateResource(options?: UseUpdateResourceOptions) {
  return useMutation({
    ...options,
    mutationFn: updateResourceAsync,
  });
}

type UseCreateFolderOptions = MutationConfig<typeof createFolderAsync>;

export function useCreateFolder(options?: UseCreateFolderOptions) {
  return useMutation({
    ...options,
    mutationFn: createFolderAsync,
  });
}

type UseSoftDeleteResourceOptions = MutationConfig<
  typeof softDeleteResourceAsync
>;

export function useSoftDeleteResource(options?: UseSoftDeleteResourceOptions) {
  return useMutation({
    ...options,
    mutationFn: softDeleteResourceAsync,
  });
}

type UseRestoreResourceOptions = MutationConfig<typeof restoreResourceAsync>;

export function useRestoreResource(options?: UseRestoreResourceOptions) {
  return useMutation({
    ...options,
    mutationFn: restoreResourceAsync,
  });
}

export type UseGetDownloadUrlOptions = MutationConfig<
  typeof getDownloadUrlAsync
>;

export function useGetDownloadUrl(options?: UseGetDownloadUrlOptions) {
  return useMutation({
    ...options,
    mutationFn: getDownloadUrlAsync,
  });
}
