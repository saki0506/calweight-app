// src/components/ui/record-card.tsx
import { Card } from '@/components/ui/card';
import { EllipsisVertical } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { ja } from 'date-fns/locale';

type RecordCardProps = {
  date: Date;
  weight: number;
  bodyFatPercentage: number;
};

export function RecordCard({ date, weight, bodyFatPercentage }: RecordCardProps) {
  const formattedDate = format(date, 'M月d日', { locale: ja });
  const weekDay = format(date, 'EEEE', { locale: ja });

  return (
    <Card className="flex flex-row items-center justify-between p-3 sm:p-4 gap-2 sm:gap-4">
      {/* 日付 */}
      <div className="min-w-[60px] sm:min-w-[70px]">
        <div className="font-medium text-xs sm:text-sm">{formattedDate}</div>
        <div className="text-[10px] sm:text-xs text-muted-foreground">
          {weekDay} {isToday(date) && '今日'}
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