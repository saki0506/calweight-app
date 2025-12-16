type DateDisplayProps = {
  date: Date;
};

export function DateDisplay({ date }: DateDisplayProps) {
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dayName = dayNames[date.getDay()];

  return (
    <div className="text-center text-gray-700 font-medium text-lg">
      {year}/{month}/{day}/{dayName}
    </div>
  );
}