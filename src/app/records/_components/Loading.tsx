// src/app/records/_components/Loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export function RecordCardSkeleton() {
  return (
    <div className="flex items-center justify-between p-3 sm:p-4 border rounded-xl">
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
      <div className="text-center space-y-2">
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-4 w-14" />
      </div>
      <div className="text-center space-y-2">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-6 w-6" />
    </div>
  );
}

export function RecordListSkeleton() {
  return (
    <div className="space-y-2 sm:space-y-3">
      {[...Array(5)].map((_, i) => (
        <RecordCardSkeleton key={i} />
      ))}
    </div>
  );
}