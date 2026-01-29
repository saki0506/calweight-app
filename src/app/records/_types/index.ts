// src/app/records/_types/index.ts
import type { WeightRecord } from '@/db/schema';

export type { WeightRecord };

export type Cursor = {
  date: string;
  id: string;
};