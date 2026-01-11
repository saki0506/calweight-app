import type { WeightRecordDto } from "../_actions/getWeightRecords";

type Props = {
  record: WeightRecordDto;
};

export function RecordCard({ record }: Props) {
  const dateObj = new Date(record.date);

  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const weekday = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"][dateObj.getDay()];

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
      <div className="flex flex-col">
        <span className="text-base font-semibold text-gray-800">
          {month}月{day}日
        </span>
        <span className="text-xs text-gray-500">{weekday}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">体重</span>
          <span className="text-base font-bold text-gray-800">
            {record.weight}kg
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">体脂肪率</span>
          <span className="text-base font-bold text-gray-800">
            {record.fat ? `${record.fat}%` : "-"}
          </span>
        </div>

        <button
          type="button"
          aria-label="メニューを開く"
          className="p-1 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>
    </div>
  );
}