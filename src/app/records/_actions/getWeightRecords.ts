// src/app/records/_actions/getWeightRecords.ts
'use server';

import { db } from '@/db';
import { weightRecords } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { PAGE_SIZE } from '../_constants';
import type { WeightRecordsPage } from '../_types';

export async function getWeightRecords(pageParam: number): Promise<WeightRecordsPage> {
  // ログインユーザーのIDを取得
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { records: [], nextPage: undefined };
  }

  const offset = pageParam * PAGE_SIZE;

  const records = await db
    .select()
    .from(weightRecords)
    .where(eq(weightRecords.userId, user.id))  // ← ユーザーIDでフィルタ
    .orderBy(desc(weightRecords.date))
    .limit(PAGE_SIZE)
    .offset(offset);

  return {
    records,
    nextPage: records.length === PAGE_SIZE ? pageParam + 1 : undefined,
  };
}