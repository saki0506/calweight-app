// src/app/records/_types/index.ts
import type { WeightRecord } from '@/db/schema';
export type { WeightRecord };

export type Cursor = {
  date: string;
  id: string;
};

// 追加
export type WeightRecordDto = {
  id: string;
  weight: number;
  fat: number | null;
  date: string;
};