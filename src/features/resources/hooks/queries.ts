import type { QueryConfig } from "@/shared/lib/tanstack-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { listResourcesAsync } from "../api";
import type { ListResourcesQueryParams } from "../types";

type UseListResourcesOptions = {
  query?: ListResourcesQueryParams;
} & QueryConfig<typeof listResourcesQueryOptions>;

export const listResourcesQueryOptions = (
  query: ListResourcesQueryParams = {},
) =>
  queryOptions({
    queryKey: ["resources", query],
    queryFn: () => listResourcesAsync(query),
  });

export function useListResources({
  query = {},
  ...queryConfig
}: UseListResourcesOptions = {}) {
  return useQuery({
    ...listResourcesQueryOptions(query),
    ...queryConfig,
  });
}
