'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';

export async function updateProfile(data: {
  name: string;
  targetWeight: string;
}) {
  // Supabaseから現在のユーザーを取得
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();

  if (authData?.claims?.sub === undefined) {
    throw new Error('認証されていません');
  }

  // データベースを更新
  const result = await db
    .update(users)
    .set({
      name: data.name,
      targetWeight: data.targetWeight,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(users.id, authData.claims.sub))
    .returning();

  return result;
}