'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function checkProfileSetup(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  return !!user?.name && !!user?.targetWeight;
}