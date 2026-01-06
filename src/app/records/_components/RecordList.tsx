// src/app/records/_components/RecordList.tsx
'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { RecordCard } from '@/components/ui/record-card';
import { useWeightRecords } from '../_hooks/useWeightRecords';
import { RecordCardSkeleton } from './Loading';

export function RecordList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWeightRecords();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const records = data?.pages.flatMap((page) => page.records) ?? [];

  if (records.length === 0) {
    return <p className="text-center text-gray-500">記録がありません</p>;
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {records.map((record) => (
        <RecordCard
          key={record.id}
          date={new Date(record.date)}
          weight={Number(record.weight)}
          bodyFatPercentage={record.fat ? Number(record.fat) : 0}
        />
      ))}

      <div ref={ref} className="h-4" />

      {isFetchingNextPage && <RecordCardSkeleton />}

      {!hasNextPage && records.length > 0 && (
        <p className="text-center text-gray-400 text-sm">
          すべて読み込みました
        </p>
      )}
    </div>
  );
}