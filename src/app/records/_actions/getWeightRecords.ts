"use server";

import { createClient } from "@/lib/supabase/server";
import { getWeightRecordsByUserId } from "@/db/queries/weight-records";

export type WeightRecordDto = {
  id: string;
  weight: number;
  fat: number | null;
  date: string;
};

export type WeightRecordsResult = {
  records: WeightRecordDto[];
  nextCursor: string | null;
};

export async function getWeightRecords(
  cursor?: string
): Promise<WeightRecordsResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("認証が必要です");
  }

  const result = await getWeightRecordsByUserId({
    userId: user.id,
    cursor,
    limit: 10,
  });

  return {
    records: result.records.map((record) => ({
      id: record.id,
      weight: Number(record.weight),
      fat: record.fat ? Number(record.fat) : null,
      date: record.date,
    })),
    nextCursor: result.nextCursor,
  };
}