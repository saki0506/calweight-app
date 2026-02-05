// src/app/records/_hooks/useDeleteRecord.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

async function deleteWeightRecord(id: string) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('ログインが必要です');
  }

  // 論理削除（deleted_atに現在時刻をセット）
  const { error } = await supabase
    .from('weight_records')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}

export function useDeleteRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWeightRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weightRecords'] });
      toast.success('記録を削除しました');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : '不明なエラー';
      toast.error(`削除に失敗しました: ${message}`);
    },
  });
}