// src/app/records/_components/Loading.tsx
export function RecordListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl animate-pulse"
        >
          <div className="flex flex-col gap-1">
            <div className="h-5 bg-gray-200 rounded w-16" />
            <div className="h-3 bg-gray-200 rounded w-10" />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <div className="h-3 bg-gray-200 rounded w-8" />
              <div className="h-5 bg-gray-200 rounded w-14" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-3 bg-gray-200 rounded w-10" />
              <div className="h-5 bg-gray-200 rounded w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}