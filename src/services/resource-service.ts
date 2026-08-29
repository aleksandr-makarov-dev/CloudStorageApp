import type { CreateUploadUrlRequest } from "../models/create-upload-url-request";
import type { CreateUploadUrlResponse } from "../models/create-upload-url-response";

export async function CreateUploadUrlAsync(
  request: CreateUploadUrlRequest,
): Promise<CreateUploadUrlResponse> {
  return {
    id: "",
    url: "",
    expiresAtUtc: "",
    formFields: {},
  };
}
