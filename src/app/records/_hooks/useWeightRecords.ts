// src/app/records/_hooks/useWeightRecords.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { getWeightRecords } from '../_actions/getWeightRecords';

export function useWeightRecords() {
  return useInfiniteQuery({
    queryKey: ['weightRecords'],
    queryFn: ({ pageParam }) => getWeightRecords(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
}