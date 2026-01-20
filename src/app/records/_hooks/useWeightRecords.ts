// src/app/records/_hooks/useWeightRecords.ts
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

const PAGE_SIZE = 10;

async function fetchWeightRecords(pageParam: number) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("ログインが必要です");
  }

  const from = pageParam * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from("weight_records")
    .select("id, weight, fat, date")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("date", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    records: data,
    nextPage: data.length === PAGE_SIZE ? pageParam + 1 : undefined,
  };
}

export function useWeightRecords() {
  return useSuspenseInfiniteQuery({
    queryKey: ["weightRecords"],
    queryFn: ({ pageParam }) => fetchWeightRecords(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
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