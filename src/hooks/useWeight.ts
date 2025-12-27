'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveWeightRecord, type SaveWeightInput } from '@/app/weight-input/actions';
import { weightRecordKeys } from '@/lib/query-keys';

export function useSaveWeightRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveWeightInput) => saveWeightRecord(input),
    onSuccess: () => {
      // 全ての weightRecords 関連キャッシュを無効化
      queryClient.invalidateQueries({ queryKey: weightRecordKeys.all() });
    },
  });
}