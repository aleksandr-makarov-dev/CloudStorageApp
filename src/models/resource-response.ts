export type ResourceResponse = {
  id: string;
  name: string;
  contentType: string;
  contentLength: bigint;
  createdAtUtc: string;
  lastModifiedAtUtc?: string;
};
