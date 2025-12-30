// src/app/records/page.tsx
'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useQueryState } from 'nuqs';
import { RecordCard } from '@/components/ui/record-card';
import { ContentCard } from '@/components/ui/auth-card';
import { BottomNavigation, TabId } from '@/components/ui/bottom-navigation';
import { useWeightRecords } from './_hooks/useWeightRecords';
import { Loading } from './_components/Loading';

export default function RecordsPage() {
  const [activeTab, setActiveTab] = useQueryState('tab', {
    defaultValue: 'graph' as TabId,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useWeightRecords();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const records = data?.pages.flatMap((page) => page.records) ?? [];

  return (
    <div className="min-h-screen pb-20 p-4 sm:p-6 md:p-8">
      <div className="max-w-md mx-auto">
        <ContentCard>
          <div className="mb-4">
            <span className="bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-300 text-xs sm:text-sm font-medium">
              記録一覧
            </span>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {isLoading && <Loading />}

            {isError && (
              <p className="text-center text-red-500">
                エラー: {error?.message ?? '読み込みに失敗しました'}
              </p>
            )}

            {records.map((record) => (
              <RecordCard
                key={record.id}
                date={new Date(record.date)}
                weight={record.weight}
                bodyFatPercentage={record.fat ?? 0}
              />
            ))}

            <div ref={ref} className="h-4" />

            {isFetchingNextPage && <Loading />}

            {!hasNextPage && records.length > 0 && (
              <p className="text-center text-gray-400 text-sm">
                すべて読み込みました
              </p>
            )}

            {!isLoading && records.length === 0 && (
              <p className="text-center text-gray-500">記録がありません</p>
            )}
          </div>
        </ContentCard>
      </div>

      <BottomNavigation
        activeTab={activeTab as TabId}
        onTabChange={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
