//src/app/api/profile/setup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { profileSetupSchema } from '@/app/profile-setup/_components/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const validatedData = profileSetupSchema.parse(body);

    // テスト用にuserIdを固定（後で認証から取得するように変更予定）
    const userId = 'test-user-id';

    // データベースを更新
    const result = await db
      .update(users)
      .set({
        name: validatedData.name,
        targetWeight: validatedData.targetWeight,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, userId))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'プロフィールを更新しました',
      data: result[0],
    });
  } catch (error) {
    console.error('Profile setup error:', error);

    if (error instanceof Error && error.message.includes('Validation error')) {
      return NextResponse.json(
        {
          success: false,
          error: 'バリデーションエラーが発生しました',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}