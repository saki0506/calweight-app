// src/app/records/_hooks/useWeightRecords.ts
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getWeightRecords } from "../_actions/getWeightRecords";

export function useWeightRecords() {
  return useSuspenseInfiniteQuery({
    queryKey: ["weightRecords"],
    queryFn: ({ pageParam }) => getWeightRecords(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    select: (data) => data.pages.flatMap((page) => page.records),
  });
}