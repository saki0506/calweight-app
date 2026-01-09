import { useInfiniteQuery } from "@tanstack/react-query";
import type { WeightRecordsResponse } from "@/types/weight-record";

export const WEIGHT_RECORDS_QUERY_KEY = ["weightRecords"] as const;

export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchWeightRecords(
  cursor?: string
): Promise<WeightRecordsResponse> {
  const url = cursor
    ? `/api/weight-records?cursor=${encodeURIComponent(cursor)}`
    : "/api/weight-records";

  const response = await fetch(url);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(
      body.error ?? "体重記録の取得に失敗しました",
      body.code
    );
  }

  return response.json();
}

export function useWeightRecords() {
  return useInfiniteQuery({
    queryKey: WEIGHT_RECORDS_QUERY_KEY,
    queryFn: ({ pageParam }) => fetchWeightRecords(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}