// src/app/calendar/page.tsx
'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useEffect, useState } from 'react'

type WeightRecord = {
  id: string
  date: string
  weight: string
  fat: string | null
}

export default function CalendarPage() {
  const [records, setRecords] = useState<WeightRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/weight-records')
      .then(res => res.json())
      .then(data => setRecords(data))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false))
  }, [])

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