// src/app/api/weight-records/route.ts
import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { weightRecords } from '@/db/schema'
import { eq, isNull, and } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const records = await db
    .select()
    .from(weightRecords)
    .where(and(
      eq(weightRecords.userId, user.id),
      isNull(weightRecords.deletedAt)
    ))

  return NextResponse.json(records)
}