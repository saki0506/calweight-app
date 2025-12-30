// src/app/records/_hooks/useWeightRecords.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { PAGE_SIZE } from '../_constants';
import { WeightRecord } from '../_types';

async function fetchWeightRecords(pageParam: number) {
  const supabase = createClient();

  const from = pageParam * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from('weight_records')
    .select('id, weight, fat, date')
    .order('date', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    records: data as WeightRecord[],
    nextPage: data.length === PAGE_SIZE ? pageParam + 1 : undefined,
  };
}

export function useWeightRecords() {
  return useInfiniteQuery({
    queryKey: ['weightRecords'],
    queryFn: ({ pageParam = 0 }) => fetchWeightRecords(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
}