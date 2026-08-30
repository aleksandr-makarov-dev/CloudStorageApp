import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "../lib/tanstack-query";
import { updateResourceAsync } from "../services/resource-service";

type UseUpdateResourceOptions = {
  mutationConfig?: MutationConfig<typeof updateResourceAsync>;
};

export function useUpdateResource({
  mutationConfig,
}: UseUpdateResourceOptions = {}) {
  return useMutation({
    ...mutationConfig,
    mutationFn: updateResourceAsync,
  });
}
