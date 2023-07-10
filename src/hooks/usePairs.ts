import { useQuery } from "@tanstack/react-query";
import { fck } from "api";

export type PairType = {
  id: number;
  jetton1_id: number;
  jetton2_id: number;
}[];

export function usePairs(
  key: string,
  ids?: number[],
  page = 1,
  limit = 10,
): PairType {
  const { data } = useQuery({
    queryKey: [`pairs`, key, ids, page],
    queryFn: async ({ signal }) =>
      await fck.getPairs({
        signal,
        limit,
        offset: page > 1 ? (page - 1) * limit : "",
        jetton_ids: (ids || [])?.join(","),
      }),
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      enabled: !!ids?.length,
    select: (response) =>
      Object.keys(response?.pairs)?.map((id) => response?.pairs[id])?.flat(),
  });

  return data || [];
}
