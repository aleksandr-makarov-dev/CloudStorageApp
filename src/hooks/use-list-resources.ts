import { queryOptions, useQuery } from "@tanstack/react-query";
import type { ListResourcesQueryParams } from "../models/list-resources-query-params";
import { listResourcesAsync } from "../services/resource-service";
import type { QueryConfig } from "../lib/tanstack-query";

export const listResourcesQueryOptions = (
  query: ListResourcesQueryParams = {},
) => {
  return queryOptions({
    //TODO: update query params
    queryKey: ["resources"],
    queryFn: () => listResourcesAsync(query),
  });
};

type UseListResourcesOptions = {
  query?: ListResourcesQueryParams;
  queryConfig?: QueryConfig<typeof listResourcesQueryOptions>;
};

export function useListResources({
  query,
  queryConfig,
}: UseListResourcesOptions = {}) {
  return useQuery({
    ...listResourcesQueryOptions(query),
    ...queryConfig,
  });
}
