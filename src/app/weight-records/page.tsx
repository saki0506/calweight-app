"use client";

import { Suspense } from "react";
import { RecordList } from "./_components/RecordList";
import { RecordListSkeleton } from "./_components/RecordListSkeleton";

export default function WeightRecordsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">体重記録</h1>
      <Suspense fallback={<RecordListSkeleton />}>
        <RecordList />
      </Suspense>
    </div>
  );
}