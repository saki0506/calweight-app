'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function checkProfileSetup(userId: string) {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!result || result.length === 0) {
      return { isComplete: false, error: 'ユーザーが見つかりません' };
    }

    const user = result[0];

    // 名前と目標体重が両方設定されているか確認
    const isComplete = !!user.name && !!user.targetWeight;

    return {
      isComplete,
      name: user.name,
      targetWeight: user.targetWeight,
    };
  } catch (error) {
    console.error('Profile check error:', error);
    return { isComplete: false, error: 'プロフィール確認エラー' };
  }
}