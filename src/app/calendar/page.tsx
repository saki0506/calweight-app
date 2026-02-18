// src/app/calendar/page.tsx
'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useQuery } from '@tanstack/react-query'

type WeightRecord = {
  id: string
  date: string
  weight: string
  fat: string | null
}

export default function CalendarPage() {
  const { data: records = [], isLoading } = useQuery<WeightRecord[]>({
    queryKey: ['weight-records'],
    queryFn: () => fetch('/api/weight-records').then(res => res.json()),
  })

  if (isLoading) return <div>読み込み中...</div>

  const events = records.map(record => ({
    title: `${record.weight}kg`,
    date: new Date(record.date).toLocaleDateString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\//g, '-'),
    allDay: true,
  }))

  return (
    <div className="p-2 md:p-4 w-full overflow-hidden">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale="ja"
        events={events}
        height="auto"
      />
    </div>
  )
}