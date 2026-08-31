import { z } from "zod";

export type UploadToBucketParams = {
  file: File;
  url: string;
  formFields: Record<string, string>;
};

export type CreateUploadUrlRequest = {
  name: string;
  contentType: string;
  contentLength: number;
};

export type CreateUploadUrl = {
  id: string;
  url: string;
  expiresAtUtc: string;
  formFields: Record<string, string>;
};

export type Resource = {
  id: string;
  name: string;
  contentType: string;
  contentLength: bigint;
  createdAtUtc: string;
  lastModifiedAtUtc?: string;
};

export type ListResourcesQueryParams = {
  page?: number;
  size?: number;
};

export const updateResourceInputSchema = z.object({
  name: z.string().min(1).max(128),
});

export type UpdateResourceRequest = z.infer<typeof updateResourceInputSchema>;
