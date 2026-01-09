import { db } from "@/db";
import { weightRecords, type WeightRecord } from "@/db/schema";
import { and, desc, eq, isNull, lt } from "drizzle-orm";

const DEFAULT_LIMIT = 10;

type GetWeightRecordsParams = {
  userId: string;
  cursor?: string;
  limit?: number;
};

type GetWeightRecordsResult = {
  records: WeightRecord[];
  nextCursor: string | null;
  hasMore: boolean;
};

export async function getWeightRecordsByUserId({
  userId,
  cursor,
  limit = DEFAULT_LIMIT,
}: GetWeightRecordsParams): Promise<GetWeightRecordsResult> {
  const fetchLimit = limit + 1;

  const baseConditions = [
    eq(weightRecords.userId, userId),
    isNull(weightRecords.deletedAt),
  ];

  const whereConditions = cursor
    ? and(...baseConditions, lt(weightRecords.id, cursor))
    : and(...baseConditions);

  const result = await db
    .select()
    .from(weightRecords)
    .where(whereConditions)
    .orderBy(desc(weightRecords.date), desc(weightRecords.id))
    .limit(fetchLimit);

  const hasMore = result.length > limit;
  const recordsToReturn = hasMore ? result.slice(0, limit) : result;
  const nextCursor = hasMore
    ? recordsToReturn[recordsToReturn.length - 1]?.id ?? null
    : null;

  return {
    records: recordsToReturn,
    nextCursor,
    hasMore,
  };
}