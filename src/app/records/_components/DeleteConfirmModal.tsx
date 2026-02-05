// src/app/records/_components/DeleteConfirmModal.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeleteRecord } from '../_hooks/useDeleteRecord';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { WeightRecordDto } from '../_types';

type Props = {
  record: WeightRecordDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteConfirmModal({ record, open, onOpenChange }: Props) {
  const { mutate: deleteRecord, isPending } = useDeleteRecord();

  const handleDelete = () => {
    if (!record) return;

    deleteRecord(record.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const formattedDate = record
    ? format(new Date(record.date), 'M月d日', { locale: ja })
    : '';

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isPending) onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>記録を削除</DialogTitle>
          <DialogDescription>
            {formattedDate}の記録を削除しますか？この操作は取り消せません。
          </DialogDescription>
        </DialogHeader>

        {record && (
          <div className="py-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">体重</span>
              <span className="font-medium">{record.weight}kg</span>
            </div>
            {record.fat != null && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">体脂肪率</span>
                <span className="font-medium">{record.fat}%</span>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            キャンセル
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? '削除中...' : '削除する'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}