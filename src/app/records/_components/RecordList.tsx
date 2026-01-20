// src/app/records/_components/RecordList.tsx
"use client";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useWeightRecords } from "../_hooks/useWeightRecords";
import { RecordCard } from "@/components/ui/record-card";

export function RecordList() {
  const { ref, inView } = useInView({ threshold: 0, rootMargin: "100px" });
  const {
    data: records,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useWeightRecords();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return (
      <div className="p-3 bg-red-50 text-red-500 rounded-lg text-sm">
        データの取得に失敗しました
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">記録がありません</div>
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <RecordCard
          key={record.id}
          date={new Date(record.date)}
          weight={Number(record.weight)}
          bodyFatPercentage={record.fat != null ? Number(record.fat) : 0}
        />
      ))}
      <div ref={ref} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && (
          <span className="text-sm text-gray-500">読み込み中...</span>
        )}
        {!hasNextPage && records.length > 0 && (
          <span className="text-sm text-gray-500">すべて読み込みました</span>
        )}
      </div>
    </div>
  );
}