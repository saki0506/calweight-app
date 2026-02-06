// src/app/weight-input/_components/date-display.tsx
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

type DateDisplayProps = {
  date: Date;
  onDateChange: (date: Date) => void;
};

export function DateDisplay({ date, onDateChange }: DateDisplayProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-center text-gray-700 font-medium text-lg hover:bg-gray-100"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(date, 'yyyy/MM/dd/E', { locale: ja })}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              onDateChange(selectedDate);
              setOpen(false);
            }
          }}
          showOutsideDays={false}
          disabled={{ after: new Date() }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}