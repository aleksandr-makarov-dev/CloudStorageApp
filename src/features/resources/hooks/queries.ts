import type { QueryConfig } from "@/shared/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { listResourcesAsync, listTrashAsync } from "../api";
import {
  type Resource,
  type ListResourcesQuery,
  type ListTrashQuery,
} from "../types";
import type { ApiError } from "@/shared/api/api-error";

type UseListResourcesOptions = {
  query?: ListResourcesQuery;
} & QueryConfig<typeof listResourcesQueryOptions>;

export const listResourcesQueryOptions = (query: ListResourcesQuery = {}) =>
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

type UseListTrashOptions = { query?: ListTrashQuery } & QueryConfig<
  typeof listTrashQueryOptions
>;

export const listTrashQueryOptions = (query: ListTrashQuery = {}) =>
  queryOptions<Resource[], ApiError>({
    queryKey: ["resources", "trash"],
    queryFn: () => listTrashAsync(query),
  });

export function useListTrash({
  query = {},
  ...queryConfig
}: UseListTrashOptions = {}) {
  return useQuery({
    ...listTrashQueryOptions(query),
    ...queryConfig,
  });
}
