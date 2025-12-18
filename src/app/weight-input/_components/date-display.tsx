import { formatDateWithDay } from '@/lib/date';

type DateDisplayProps = {
  date: Date;
};

export function DateDisplay({ date }: DateDisplayProps) {
  return (
    <div className="text-center text-gray-700 font-medium text-lg">
      {formatDateWithDay(date)}
    </div>
  );
}