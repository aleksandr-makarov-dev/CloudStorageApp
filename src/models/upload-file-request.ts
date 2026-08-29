export type UploadFileRequest = {
  file: File;
  url: string;
  formFields: Record<string, string>;
};
