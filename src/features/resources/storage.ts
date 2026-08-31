import axios from "axios";
import type { UploadToBucketParams } from "./types";

export async function uploadToBucketAsync(
  params: UploadToBucketParams,
): Promise<void> {
  const formData = new FormData();

  for (const [key, value] of Object.entries(params.formFields)) {
    formData.append(key, value);
  }

  formData.append("Content-Type", params.file.type);
  formData.append("file", params.file);

  await axios.post(params.url, formData);
}
