// src/app/records/_components/RecordList.tsx
"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useWeightRecords } from "../_hooks/useWeightRecords";
import { RecordCard } from "@/components/ui/record-card";
import { EditRecordModal } from "./EditRecordModal";
import { WeightRecordDto } from "../_types";

type WeightRecordDto = {
  id: string;
  weight: number;
  fat: number | null;
  date: string;
};

export function RecordList() {
  const { ref, inView } = useInView({ threshold: 0, rootMargin: "100px" });
  const {
    data: records,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useWeightRecords();

  // 編集モーダル用の状態
  const [editingRecord, setEditingRecord] = useState<WeightRecordDto | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (record: WeightRecordDto) => {
    setEditingRecord(record);
    setIsEditModalOpen(true);
  };

  const handleDelete = (record: WeightRecordDto) => {
    // PR2で実装
    console.log("削除:", record.id);
  };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return (
      <div className="p-3 bg-red-50 text-red-500 rounded-lg text-sm">
        データの取得に失敗しました
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">記録がありません</div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {records.map((record) => (
          <RecordCard
            key={record.id}
            date={new Date(record.date)}
            weight={Number(record.weight)}
            bodyFatPercentage={record.fat != null ? Number(record.fat) : 0}
            onEdit={() => handleEdit(record)}
            onDelete={() => handleDelete(record)}
          />
        ))}
        <div ref={ref} className="h-10 flex items-center justify-center">
          {isFetchingNextPage && (
            <span className="text-sm text-gray-500">読み込み中...</span>
          )}
          {!hasNextPage && records.length > 0 && (
            <span className="text-sm text-gray-500">すべて読み込みました</span>
          )}
        </div>
      </div>

      <EditRecordModal
        record={editingRecord}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
    </>
  );
}