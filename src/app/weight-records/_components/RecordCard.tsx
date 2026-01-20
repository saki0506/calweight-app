import type { WeightRecordDto } from "@/types/weight-record";

type Props = {
  record: WeightRecordDto;
};

export function RecordCard({ record }: Props) {
  const formattedDate = new Date(record.date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <time className="text-sm text-gray-500">{formattedDate}</time>
      <div className="mt-2 flex gap-6">
        <div>
          <span className="text-2xl font-bold">{record.weight}</span>
          <span className="text-gray-500 ml-1">kg</span>
        </div>
        {record.fat && (
          <div>
            <span className="text-2xl font-bold">{record.fat}</span>
            <span className="text-gray-500 ml-1">%</span>
          </div>
        )}
      </div>
    </div>
  );
}