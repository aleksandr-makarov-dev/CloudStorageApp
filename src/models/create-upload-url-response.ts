export type CreateUploadUrlResponse = {
  id: string;
  url: string;
  expiresAtUtc: string;
  formFields: Record<string, string>;
};
