import type { QueryConfig } from "@/shared/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { listResourcesAsync } from "../api";
import { type Resource, type ListResourcesQueryParams } from "../types";
import type { ApiError } from "@/shared/api/api-error";

type UseListResourcesOptions = {
  query?: ListResourcesQueryParams;
} & QueryConfig<typeof listResourcesQueryOptions>;

export const listResourcesQueryOptions = (
  query: ListResourcesQueryParams = {},
) =>
  queryOptions<Resource[], ApiError>({
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
