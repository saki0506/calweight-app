// src/app/records/page.tsx
'use client';

import { Suspense } from 'react';
import { useQueryState } from 'nuqs';
import { ContentCard } from '@/components/ui/auth-card';
import { BottomNavigation, TabId } from '@/components/ui/bottom-navigation';
import { RecordListSkeleton } from './_components/Loading';
import { RecordList } from './_components/RecordList';

export default function RecordsPage() {
  const [activeTab, setActiveTab] = useQueryState('tab', {
    defaultValue: 'graph' as TabId,
  });

  return (
    <div className="min-h-screen pb-20 p-4 sm:p-6 md:p-8">
      <div className="max-w-md mx-auto">
        <ContentCard>
          <div className="mb-4">
            <span className="bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-300 text-xs sm:text-sm font-medium">
              記録一覧
            </span>
          </div>

          <Suspense fallback={<RecordListSkeleton />}>
            <RecordList />
          </Suspense>
        </ContentCard>
      </div>

      <BottomNavigation
        activeTab={activeTab as TabId}
        onTabChange={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
