import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export type GraphRecord = {
  date: string;
  weight: number;
  fat: number | null;
};

const PAGE_SIZE = 30;

type GraphPage = {
  records: GraphRecord[];
  nextCursor: string | undefined;
};

async function fetchGraphPage(cursor?: string): Promise<GraphPage> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("ログインが必要です");
  }

  let query = supabase
    .from("weight_records")
    .select("date, weight, fat")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("date", { ascending: false })
    .limit(PAGE_SIZE + 1);

  if (cursor) {
    query = query.lt("date", cursor);
  }

  const { data, error } = await query;

  if (error) throw error;

  const hasMore = data.length > PAGE_SIZE;
  const records = hasMore ? data.slice(0, PAGE_SIZE) : data;

  return {
    records: records.map((r) => ({
      date: r.date,
      weight: Number(r.weight),
      fat: r.fat ? Number(r.fat) : null,
    })),
    nextCursor: hasMore ? records[records.length - 1].date : undefined,
  };
}

async function fetchTargetWeight(): Promise<number | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("target_weight")
    .eq("id", user.id)
    .maybeSingle();

  return data?.target_weight ? Number(data.target_weight) : null;
}

export function useGraphRecords() {
  const infiniteQuery = useInfiniteQuery({
    queryKey: ["graphRecords"],
    queryFn: ({ pageParam }) => fetchGraphPage(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    select: (data) => {
      const all = data.pages.flatMap((page) => page.records);
      all.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return all;
    },
  });

  const targetWeightQuery = useQuery({
    queryKey: ["targetWeight"],
    queryFn: fetchTargetWeight,
  });

  return {
    records: infiniteQuery.data ?? [],
    targetWeight: targetWeightQuery.data ?? null,
    isLoading: infiniteQuery.isLoading,
    error: infiniteQuery.error,
    fetchNextPage: infiniteQuery.fetchNextPage,
    hasNextPage: infiniteQuery.hasNextPage,
    isFetchingNextPage: infiniteQuery.isFetchingNextPage,
  };
}