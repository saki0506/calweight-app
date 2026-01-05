// src/app/records/_types/index.ts
import type { WeightRecord } from '@/db/schema';

export type { WeightRecord };

export type WeightRecordsPage = {
  records: WeightRecord[];
  nextPage: number | undefined;
};