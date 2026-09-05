import { z } from "zod";

export type UploadToBucketParams = {
  file: File;
  url: string;
  formFields: Record<string, string>;
};

export const createUploadUrlInputSchema = z.object({
  parentId: z.string().optional(),
  name: z.string().min(1).max(128),
  contentType: z.string().min(1).max(32),
  contentLength: z.coerce.number().min(1),
});

export type CreateUploadUrlRequest = z.infer<typeof createUploadUrlInputSchema>;

export type UploadUrl = {
  id: string;
  url: string;
  expiresAtUtc: string;
  formFields: Record<string, string>;
};

export type Resource = {
  id: string;
  name: string;
  contentType?: string;
  contentLength?: bigint;
  isFolder: boolean;
  createdAtUtc: string;
  lastModifiedAtUtc?: string;
};

export type ListResourcesQuery = {
  parentId?: string;
};

export const updateResourceInputSchema = z.object({
  name: z.string().min(1).max(128),
});

export type UpdateResourceRequest = z.infer<typeof updateResourceInputSchema>;

export const createFolderInputSchema = z.object({
  parentId: z.string().optional(),
  name: z.string().min(1).max(128),
});

export type CreateFolderRequest = z.infer<typeof createFolderInputSchema>;

export type ListTrashQuery = {};

export type DownloadUrl = {
  url: string;
  expiresAtUtc: string;
};
