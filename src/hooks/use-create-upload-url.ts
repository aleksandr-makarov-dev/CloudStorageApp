import { useMutation } from "@tanstack/react-query";
import { createUploadUrlAsync } from "../services/resource-service";
import type { MutationConfig } from "../lib/tanstack-query";

type UseCreateUploadUrlOptions = {
  mutationConfig?: MutationConfig<typeof createUploadUrlAsync>;
};

export function useCreateUploadUrl({
  mutationConfig,
}: UseCreateUploadUrlOptions) {
  return useMutation({ ...mutationConfig, mutationFn: createUploadUrlAsync });
}
