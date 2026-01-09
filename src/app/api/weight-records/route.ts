import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getWeightRecordsByUserId } from "@/db/queries/weight-records";
import type {
  WeightRecordsResponse,
  ApiErrorResponse,
  WeightRecordDto,
} from "@/types/weight-record";
import type { WeightRecord } from "@/db/schema";

const querySchema = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

function toWeightRecordDto(record: WeightRecord): WeightRecordDto {
  return {
    id: record.id,
    userId: record.userId,
    weight: Number(record.weight),
    fat: record.fat ? Number(record.fat) : null,
    date: record.date,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<WeightRecordsResponse | ApiErrorResponse>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "認証が必要です", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const parseResult = querySchema.safeParse({
      cursor: searchParams.get("cursor") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "無効なパラメータです", code: "INVALID_PARAMS" },
        { status: 400 }
      );
    }

    const { cursor, limit } = parseResult.data;

    const result = await getWeightRecordsByUserId({
      userId: user.id,
      cursor,
      limit,
    });

    return NextResponse.json({
      records: result.records.map(toWeightRecordDto),
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
    });
  } catch (error) {
    console.error("[GET /api/weight-records]", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}