import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "../lib/tanstack-query";
import { completeUploadAsync } from "../services/resource-service";

type UseCompleteUploadOptions = {
  mutationConfig?: MutationConfig<typeof completeUploadAsync>;
};

export function useCompleteUpload({
  mutationConfig,
}: UseCompleteUploadOptions = {}) {
  return useMutation({ ...mutationConfig, mutationFn: completeUploadAsync });
}
