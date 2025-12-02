'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';

export async function updateProfile(data: {
  name: string;
  targetWeight: string;
}) {
  // Supabaseから現在のユーザーを取得（getClaims使用）
  const supabase = await createClient();
  const { user } = await supabase.auth.getClaims();

  if (!user) {
    throw new Error('認証されていません');
  }

  // フロントエンドでデータベースを直接更新
  const result = await db
    .update(users)
    .set({
      name: data.name,
      targetWeight: data.targetWeight,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(users.id, user.sub))
    .returning();

  return result;
}