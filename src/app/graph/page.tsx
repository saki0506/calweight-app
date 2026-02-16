"use client";

import { useEffect } from "react";
import { useGraphRecords } from "./_hooks/useGraphRecords";
import { WeightChart } from "./_components/weight-chart";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import type { TabId } from "@/components/ui/bottom-navigation";
import { useRouter } from "next/navigation";

export default function GraphPage() {
  const {
    records,
    targetWeight,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGraphRecords();
  const router = useRouter();

  // グラフページにいる間だけスワイプ戻りを無効化
useEffect(() => {
  document.body.style.overscrollBehaviorX = "none";

  const preventSwipe = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      const target = e.target as HTMLElement;
      if (target.closest("[data-chart-scroll]")) return;
      e.preventDefault();
    }
  };

  document.addEventListener("touchmove", preventSwipe, { passive: false });

  return () => {
    document.removeEventListener("touchmove", preventSwipe);
    document.body.style.overscrollBehaviorX = "";
  };
}, []);

  const handleTabChange = (tab: TabId) => {
    switch (tab) {
      case "graph":
        break;
      case "edit":
        router.push("/weight-input");
        break;
      case "calendar":
        router.push("/records");
        break;
      case "settings":
        router.push("/settings");
        break;
    }
  };

  const latestWeight = records.length > 0 ? records[records.length - 1].weight : null;
  const diff =
    latestWeight !== null && targetWeight !== null
      ? (latestWeight - targetWeight).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-[#FFB6C1]">
      <div className="pt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          {isLoading && (
            <div className="h-[400px] flex items-center justify-center text-gray-400">
              読み込み中...
            </div>
          )}

          {error && (
            <div className="h-[400px] flex items-center justify-center text-red-400">
              データの取得に失敗しました
            </div>
          )}

          {!isLoading && !error && records.length === 0 && (
            <div className="h-[400px] flex items-center justify-center text-gray-400">
              データがありません
            </div>
          )}

          {records.length > 0 && (
            <>
              {targetWeight !== null && diff !== null && (
                <p className="text-center text-sm text-gray-700 mb-2">
                  目標：{targetWeight}kg（あと{diff}kg）
                </p>
              )}

              <div className="flex gap-4 mb-3 justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#8B9F6E]" />
                  <span className="text-xs text-gray-600">体重</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#5B7AA6]" />
                  <span className="text-xs text-gray-600">体脂肪率</span>
                </div>
                {targetWeight !== null && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#FF9BAA]" />
                    <span className="text-xs text-gray-600">目標体重</span>
                  </div>
                )}
              </div>

              <WeightChart
                records={records}
                targetWeight={targetWeight}
                onLoadMore={() => fetchNextPage()}
                hasMore={!!hasNextPage}
                isLoadingMore={isFetchingNextPage}
              />
            </>
          )}
        </div>
      </div>

      <BottomNavigation activeTab="graph" onTabChange={handleTabChange} />
    </div>
  );
}