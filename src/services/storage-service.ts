import Axios from "axios";
import type { UploadFileRequest } from "../models/upload-file-request";

const axios = Axios.create();

export async function uploadFileAsync({
  url,
  formFields,
  file,
}: UploadFileRequest): Promise<void> {
  const formData = new FormData();

  for (const [key, value] of Object.entries(formFields)) {
    formData.append(key, value);
  }

  formData.append("Content-Type", file.type);
  formData.append("file", file);

  await axios.post(url, formData);
}
