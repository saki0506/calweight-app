// src/components/ui/record-card.tsx
import { Card } from '@/components/ui/card';
import { EllipsisVertical } from 'lucide-react';

type RecordCardProps = {
  date: Date;
  weight: number;
  bodyFatPercentage: number;
};

export function RecordCard({ date, weight, bodyFatPercentage }: RecordCardProps) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDay = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];

  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  return (
    <Card className="flex flex-row items-center justify-between p-3 sm:p-4 gap-2 sm:gap-4">
      {/* 日付 */}
      <div className="min-w-[60px] sm:min-w-[70px]">
        <div className="font-medium text-xs sm:text-sm">{month}月{day}日</div>
        <div className="text-[10px] sm:text-xs text-muted-foreground">
          {weekDay}曜日 {isToday && '今日'}
        </div>
      </div>

      {/* 体重 */}
      <div className="text-center">
        <div className="text-[10px] sm:text-xs text-muted-foreground">体重</div>
        <div className="font-semibold text-sm sm:text-base">
          {weight}<span className="text-xs sm:text-sm">kg</span>
        </div>
      </div>

      {/* 体脂肪率 */}
      <div className="text-center">
        <div className="text-[10px] sm:text-xs text-muted-foreground">体脂肪率</div>
        <div className="font-semibold text-sm sm:text-base">
          {bodyFatPercentage}<span className="text-xs sm:text-sm">%</span>
        </div>
      </div>

      {/* メニューアイコン */}
      <EllipsisVertical
        className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400"
        strokeWidth={1.5}
      />
    </Card>
  );
}