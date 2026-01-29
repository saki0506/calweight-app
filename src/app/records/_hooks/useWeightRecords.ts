// src/app/records/_hooks/useWeightRecords.ts
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Cursor } from "../_types";

const PAGE_SIZE = 10;

async function fetchWeightRecords(cursor?: Cursor) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("ログインが必要です");
  }

  const baseQuery = supabase
    .from("weight_records")
    .select("id, weight, fat, date")
    .eq("user_id", user.id)
    .is("deleted_at", null);

  // 「同じ日付でIDが小さい」または「日付が古い」レコードを取得
  const query = cursor
    ? baseQuery.or(`date.lt.${cursor.date},and(date.eq.${cursor.date},id.lt.${cursor.id})`)
    : baseQuery;

  const { data, error } = await query
    .order("date", { ascending: false })
    .order("id", { ascending: false })
    .limit(PAGE_SIZE + 1);

  if (error) throw error;

  const hasMore = data.length > PAGE_SIZE;
  const records = hasMore ? data.slice(0, PAGE_SIZE) : data;
  const lastRecord = records[records.length - 1];

  return {
    records,
    nextCursor: hasMore && lastRecord
      ? { date: lastRecord.date, id: lastRecord.id }
      : undefined,
  };
}

export function useWeightRecords() {
  return useSuspenseInfiniteQuery({
    queryKey: ["weightRecords"],
    queryFn: ({ pageParam }) => fetchWeightRecords(pageParam),
    initialPageParam: undefined as Cursor | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
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