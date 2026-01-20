export type WeightRecordDto = {
  id: string;
  userId: string;
  weight: number;
  fat: number | null;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type WeightRecordsResponse = {
  records: WeightRecordDto[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type ApiErrorResponse = {
  error: string;
  code?: string;
};