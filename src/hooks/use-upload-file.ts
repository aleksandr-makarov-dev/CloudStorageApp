import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "../lib/tanstack-query";
import { uploadFileAsync } from "../services/storage-service";

type UseUploadFileOptions = {
  mutationConfig?: MutationConfig<typeof uploadFileAsync>;
};

export function useUploadFile({ mutationConfig }: UseUploadFileOptions = {}) {
  return useMutation({ ...mutationConfig, mutationFn: uploadFileAsync });
}
