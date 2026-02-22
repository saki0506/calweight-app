// src/app/calendar/page.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { List, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  parseISO,
} from 'date-fns'
import { ja } from 'date-fns/locale'

type WeightRecord = {
  id: string
  date: string
  weight: string
  fat: string | null
}

type SvgPoint = {
  x: number
  y: number
  w: number
}

type SvgRow = {
  rowIdx: number
  pts: SvgPoint[]
}

type CellData = {
  x: number
  w: number
  cellTop: number
  cellBottom: number
}

// グラフ描画の定数
const GRAPH_TOP_PAD = 24
const GRAPH_BOT_PAD = 8
const GRAPH_COLOR = '#ef4444'
const GRAPH_TEXT_COLOR = '#b91c1c'

const DAYS = ['日', '月', '火', '水', '木', '金', '土']

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week'>('month')
  const gridRef = useRef<HTMLDivElement>(null)
  const cellRefs = useRef<(HTMLDivElement | null)[]>([])
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 })
  const [svgRows, setSvgRows] = useState<SvgRow[]>([])

  const { data: records = [], isLoading, isError } = useQuery<WeightRecord[]>({
    queryKey: ['weight-records'],
    queryFn: () => fetch('/api/weight-records').then(res => res.json()),
  })

  const weightMap = useMemo(() => new Map(
    records.map(r => [
      format(parseISO(r.date), 'yyyy-MM-dd'),
      parseFloat(r.weight),
    ])
  ), [records])

  const days = useMemo(() => {
    if (view === 'month') {
      const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 })
      const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 })
      return eachDayOfInterval({ start, end })
    } else {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 })
      const end = endOfWeek(currentDate, { weekStartsOn: 0 })
      return eachDayOfInterval({ start, end })
    }
  }, [currentDate, view])

  const weeks = useMemo(() => {
    const result: Date[][] = []
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7))
    }
    return result
  }, [days])

  useEffect(() => {
    cellRefs.current = cellRefs.current.slice(0, days.length)
  }, [days.length])

  const calcSvg = useCallback(() => {
    const grid = gridRef.current
    if (!grid) return
    const gridRect = grid.getBoundingClientRect()
    setSvgSize({ width: gridRect.width, height: gridRect.height })

    const newRows: SvgRow[] = weeks.map((week, rowIdx) => {
      const rowData = week.map((day, colIdx) => {
        const key = format(day, 'yyyy-MM-dd')
        const w = weightMap.get(key)
        const cellEl = cellRefs.current[rowIdx * 7 + colIdx]
        if (!cellEl || w === undefined) return null
        const cellRect = cellEl.getBoundingClientRect()
        const x = cellRect.left - gridRect.left + cellRect.width / 2
        const cellTop = cellRect.top - gridRect.top
        const cellBottom = cellRect.bottom - gridRect.top
        return { x, w, cellTop, cellBottom } satisfies CellData
      })

      const valid = rowData.filter((d): d is CellData => d !== null)
      if (valid.length === 0) return { rowIdx, pts: [] }

      const ws = valid.map(d => d.w)
      const minW = Math.min(...ws)
      const maxW = Math.max(...ws)
      const range = Math.max(maxW - minW, 1.0)
      const padding = range * 0.3

      const rowTop = valid[0].cellTop + GRAPH_TOP_PAD
      const rowBottom = valid[0].cellBottom - GRAPH_BOT_PAD

      const pts: SvgPoint[] = valid.map(d => ({
        x: d.x,
        y: rowBottom - ((d.w - (minW - padding)) / (range + padding * 2)) * (rowBottom - rowTop),
        w: d.w,
      }))

      return { rowIdx, pts }
    })

    setSvgRows(newRows)
  }, [weeks, weightMap])

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      calcSvg()
    })
    return () => cancelAnimationFrame(raf)
  }, [calcSvg])

  useEffect(() => {
    const observer = new ResizeObserver(calcSvg)
    if (gridRef.current) observer.observe(gridRef.current)
    return () => observer.disconnect()
  }, [calcSvg])

  const prev = useCallback(() => {
    if (view === 'month') setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
    else setCurrentDate(d => new Date(d.getTime() - 7 * 86400000))
  }, [view])

  const next = useCallback(() => {
    if (view === 'month') setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))
    else setCurrentDate(d => new Date(d.getTime() + 7 * 86400000))
  }, [view])

  const today = useCallback(() => setCurrentDate(new Date()), [])

  if (isLoading) return <div className="flex justify-center p-8 text-gray-400">読み込み中...</div>
  if (isError) return <div className="flex justify-center p-8 text-red-400">データの取得に失敗しました</div>

  return (
    <div className="bg-white flex flex-col" style={{ height: '100dvh' }}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-2 md:px-4 py-2 md:py-3 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-1 md:gap-2">
          <button aria-label="今日に戻る" onClick={today} className="px-2 md:px-4 py-1 md:py-1.5 rounded-full border border-gray-300 hover:bg-gray-50 text-xs md:text-sm text-gray-700 transition">今日</button>
          <button aria-label="前へ" onClick={prev} className="p-1 md:p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition"><ChevronLeft size={16} /></button>
          <button aria-label="次へ" onClick={next} className="p-1 md:p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition"><ChevronRight size={16} /></button>
          <span className="text-sm md:text-lg font-medium text-gray-700 ml-1">
            {format(currentDate, 'yyyy年M月', { locale: ja })}
          </span>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <div className="flex rounded-full border border-pink-300 overflow-hidden">
            <button
              onClick={() => setView('month')}
              className={`px-2 md:px-4 py-1 md:py-1.5 text-xs md:text-sm font-medium transition ${view === 'month' ? 'bg-pink-400 text-white' : 'bg-white text-pink-600 hover:bg-pink-50'}`}
            >
              月
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-2 md:px-4 py-1 md:py-1.5 text-xs md:text-sm font-medium transition border-l border-pink-300 ${view === 'week' ? 'bg-pink-400 text-white' : 'bg-white text-pink-600 hover:bg-pink-50'}`}
            >
              週
            </button>
          </div>
          <Link aria-label="記録一覧" href="/records" className="p-1.5 md:p-2 rounded-full bg-pink-400 hover:bg-pink-500 text-white transition">
            <List size={16} />
          </Link>
        </div>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 border-b border-pink-200 bg-pink-300 shrink-0">
        {DAYS.map((d, i) => (
          <div key={d} className={`text-center text-xs py-1 md:py-2 font-medium ${
            i === 0 ? 'text-red-200' : i === 6 ? 'text-blue-200' : 'text-white'
          }`}>{d}</div>
        ))}
      </div>

      {/* グリッド */}
      <div className="relative flex-1 overflow-hidden" ref={gridRef}>
        <div className="grid grid-cols-7 h-full" style={{ gridTemplateRows: `repeat(${weeks.length}, 1fr)` }}>
          {days.map((day, idx) => {
            const key = format(day, 'yyyy-MM-dd')
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isTodayDate = isToday(day)
            const dow = idx % 7

            return (
              <div
                key={key}
                ref={el => { cellRefs.current[idx] = el }}
                className={`border-r border-b border-pink-200 p-0.5 md:p-1 ${
                  isCurrentMonth ? 'bg-pink-50' : 'bg-gray-100'
                }`}
              >
                {isCurrentMonth && (
                  <span className={`text-xs font-medium inline-flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full ${
                    isTodayDate ? 'bg-pink-400 text-white'
                    : dow === 0 ? 'text-red-400'
                    : dow === 6 ? 'text-blue-400'
                    : 'text-gray-700'
                  }`}>
                    {format(day, 'd')}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* SVGオーバーレイ */}
        {svgSize.width > 0 && (
          <svg className="absolute inset-0 pointer-events-none" width={svgSize.width} height={svgSize.height}>
            {svgRows.map(({ rowIdx, pts }) => {
              if (pts.length < 1) return null
              return (
                <g key={rowIdx}>
                  {pts.length > 1 && (
                    <polyline
                      points={pts.map(p => `${p.x},${p.y}`).join(' ')}
                      fill="none"
                      stroke={GRAPH_COLOR}
                      strokeWidth={1.5}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  )}
                  {pts.map((p, i) => (
                    <g key={`${rowIdx}-${i}`}>
                      <circle cx={p.x} cy={p.y} r={2.5} fill={GRAPH_COLOR} />
                      <text
                        x={p.x}
                        y={p.y - 5}
                        textAnchor="middle"
                        fontSize={8}
                        fill={GRAPH_TEXT_COLOR}
                        fontWeight="500"
                      >
                        {p.w}
                      </text>
                    </g>
                  ))}
                </g>
              )
            })}
          </svg>
        )}
      </div>
    </div>
  )
}