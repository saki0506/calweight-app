"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useWeightRecords, ApiError } from "../_hooks/useWeightRecords";
import { RecordCard } from "./RecordCard";

export function RecordList() {
  const router = useRouter();
  const { ref, inView } = useInView({ threshold: 0, rootMargin: "100px" });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useWeightRecords();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (isError && error instanceof ApiError && error.code === "UNAUTHORIZED") {
      router.push("/login");
    }
  }, [isError, error, router]);

  if (isLoading) {
    return null; // Suspenseのfallbackが表示される
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-500">
        エラーが発生しました
      </div>
    );
  }

  const allRecords = data?.pages.flatMap((page) => page.records) ?? [];

  if (allRecords.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">記録がありません</div>
    );
  }

  return (
    <div className="space-y-4">
      {allRecords.map((record) => (
        <RecordCard key={record.id} record={record} />
      ))}

      <div ref={ref} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && (
          <span className="text-sm text-gray-500">読み込み中...</span>
        )}
      </div>
    </div>
  );
}