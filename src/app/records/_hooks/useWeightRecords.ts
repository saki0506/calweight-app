// src/app/records/_hooks/useWeightRecords.ts
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getWeightRecordsByUserId } from "@/db/queries/weight-records";

async function fetchWeightRecords(cursor?: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("ログインが必要です");
  }

  return getWeightRecordsByUserId({
    userId: user.id,
    cursor,
    limit: 10,
  });
}

export function useWeightRecords() {
  return useSuspenseInfiniteQuery({
    queryKey: ["weightRecords"],
    queryFn: ({ pageParam }) => fetchWeightRecords(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    select: (data) =>
      data.pages.flatMap((page) =>
        page.records.map((record) => ({
          id: record.id,
          weight: Number(record.weight),
          fat: record.fat ? Number(record.fat) : null,
          date: record.date,
        }))
      ),
  });
}