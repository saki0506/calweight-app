import { Suspense } from 'react';
import { WeightInputContent } from './_components/weight-input-content';

export default function WeightInputPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <WeightInputContent />
    </Suspense>
  );
}