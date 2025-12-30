// src/app/records/page.tsx
'use client';

import { useState } from 'react';
import { RecordCard } from '@/components/ui/record-card';
import { ContentCard } from '@/components/ui/auth-card';
import { BottomNavigation, TabId } from '@/components/ui/bottom-navigation';
import { testRecords } from './test-data';

export default function RecordsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('graph');

  return (
    <div className="min-h-screen pb-20 p-4 sm:p-6 md:p-8">
      <div className="max-w-md mx-auto">
        <ContentCard>
          {/* タイトル */}
          <div className="mb-4">
            <span className="bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-300 text-xs sm:text-sm font-medium">
              記録一覧
            </span>
          </div>

          {/* カードリスト */}
          <div className="space-y-2 sm:space-y-3">
            {testRecords.map((record) => (
              <RecordCard
                key={record.date}
                date={new Date(record.date)}
                weight={record.weight}
                bodyFatPercentage={record.bodyFatPercentage}
              />
            ))}
          </div>
        </ContentCard>
      </div>

      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}