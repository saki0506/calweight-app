'use server';

import { createClient } from '@/lib/supabase/server';

export type SaveWeightInput = {
  weight: number;
  fat?: number | null;
  date: string;
};

export async function saveWeightRecord(input: SaveWeightInput) {
  const supabase = await createClient();

  // サーバー側で認証チェック
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('ログインが必要です');
  }

  const { data, error } = await supabase
    .from('weight_records')
    .insert({
      user_id: user.id,
      weight: input.weight,
      fat: input.fat || null,
      date: input.date,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}