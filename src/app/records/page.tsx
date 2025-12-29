// src/app/records/page.tsx
'use client';

import { useState } from 'react';
import { RecordCard } from '@/components/ui/record-card';
import { AuthCard } from '@/components/ui/auth-card';
import { BottomNavigation, TabId } from '@/components/ui/bottom-navigation';

export default function RecordsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('graph');

  return (
    <div className="min-h-screen pb-20 p-4 sm:p-6 md:p-8">
      <div className="max-w-md mx-auto">
        {/* 白いカード */}
        <AuthCard>
          {/* タイトル - 左上配置 */}
          <div className="mb-4">
            <span className="bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-300 text-xs sm:text-sm font-medium">
              記録一覧
            </span>
          </div>

          {/* カードリスト */}
          <div className="space-y-2 sm:space-y-3">
            <RecordCard date={new Date(2024, 9, 1)} weight={62.5} bodyFatPercentage={22.3} />
            <RecordCard date={new Date(2024, 9, 2)} weight={62.3} bodyFatPercentage={22.1} />
            <RecordCard date={new Date(2024, 9, 3)} weight={62.1} bodyFatPercentage={22.0} />
            <RecordCard date={new Date(2024, 9, 4)} weight={61.9} bodyFatPercentage={21.8} />
            <RecordCard date={new Date(2024, 9, 5)} weight={61.7} bodyFatPercentage={21.5} />
            <RecordCard date={new Date(2024, 9, 6)} weight={61.5} bodyFatPercentage={21.3} />
            <RecordCard date={new Date(2024, 9, 7)} weight={61.3} bodyFatPercentage={21.0} />
            <RecordCard date={new Date(2024, 9, 8)} weight={61.1} bodyFatPercentage={20.8} />
          </div>
        </AuthCard>
      </div>

      {/* ボトムナビゲーション */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}