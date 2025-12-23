'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveWeightRecord, type SaveWeightInput } from '@/app/weight-input/actions';

export function useSaveWeightRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveWeightInput) => saveWeightRecord(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightRecords'] });
    },
  });
}