// src/app/records/_hooks/useUpdateRecord.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

type UpdateParams = {
  id: string;
  weight: number;
  fat: number | null;
};

async function updateWeightRecord({ id, weight, fat }: UpdateParams) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('ログインが必要です');
  }

  const { error } = await supabase
    .from('weight_records')
    .update({ weight, fat })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}

export function useUpdateRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWeightRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightRecords'] });
      toast.success('記録を更新しました');
    },
    onError: (error) => {
      toast.error(`更新に失敗しました: ${error.message}`);
    },
  });
}