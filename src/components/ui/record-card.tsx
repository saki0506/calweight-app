// src/components/ui/record-card.tsx
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { ja } from 'date-fns/locale';

type RecordCardProps = {
  date: Date;
  weight: number;
  bodyFatPercentage: number;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function RecordCard({
  date,
  weight,
  bodyFatPercentage,
  onEdit,
  onDelete,
}: RecordCardProps) {
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

      {/* ドロップダウンメニュー */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            aria-label="メニューを開く"
          >
            <EllipsisVertical
              className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400"
              strokeWidth={1.5}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          side="right"
          sideOffset={24}
          alignOffset={-20}
          avoidCollisions={false}
        >
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            編集
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}