// 階層構造で管理
export const weightRecordKeys = {
  // 全ての weightRecords 関連
  all: () => ['weightRecords'] as const,

  // 一覧系
  lists: () => [...weightRecordKeys.all(), 'list'] as const,
  list: (filters?: string) => [...weightRecordKeys.lists(), { filters }] as const,

  // 詳細系
  details: () => [...weightRecordKeys.all(), 'detail'] as const,
  detail: (id: string) => [...weightRecordKeys.details(), id] as const,
};