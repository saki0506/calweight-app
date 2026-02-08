"use client";

import { useRef, useEffect, useMemo, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { format, parseISO, getMonth } from "date-fns";
import type { GraphRecord } from "../_hooks/useGraphRecords";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

type WeightChartProps = {
  records: GraphRecord[];
  targetWeight: number | null;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
};

export function WeightChart({
  records,
  targetWeight,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: WeightChartProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevScrollWidthRef = useRef<number>(0);
  const isInitialRef = useRef(true);

  const labels = records.map((r) => format(parseISO(r.date), "M/d"));

  const monthBorders = useMemo(() => {
    const borders: number[] = [];
    for (let i = 1; i < records.length; i++) {
      const prevMonth = getMonth(parseISO(records[i - 1].date));
      const currMonth = getMonth(parseISO(records[i].date));
      if (prevMonth !== currMonth) {
        borders.push(i);
      }
    }
    return borders;
  }, [records]);

  // 初期表示時は右端にスクロール
  useEffect(() => {
    if (scrollRef.current && isInitialRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
      isInitialRef.current = false;
      prevScrollWidthRef.current = scrollRef.current.scrollWidth;
    }
  }, [records]);

  // 過去データ追加時にスクロール位置を維持
  useEffect(() => {
    if (scrollRef.current && !isInitialRef.current) {
      const newScrollWidth = scrollRef.current.scrollWidth;
      const diff = newScrollWidth - prevScrollWidthRef.current;
      if (diff > 0) {
        scrollRef.current.scrollLeft += diff;
      }
      prevScrollWidthRef.current = newScrollWidth;
    }
  }, [records.length]);

  // 左端に近づいたら追加読み込み
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !hasMore || isLoadingMore) return;
    if (scrollRef.current.scrollLeft < 100) {
      onLoadMore();
    }
  }, [hasMore, isLoadingMore, onLoadMore]);

  const datasets = [
    {
      label: "体重 (kg)",
      data: records.map((r) => r.weight),
      borderColor: "#8B9F6E",
      backgroundColor: "#8B9F6E",
      yAxisID: "y-weight",
      tension: 0.3,
      pointRadius: 3,
      pointHoverRadius: 5,
    },
    {
      label: "体脂肪率 (%)",
      data: records.map((r) => r.fat),
      borderColor: "#5B7AA6",
      backgroundColor: "#5B7AA6",
      yAxisID: "y-fat",
      tension: 0.3,
      pointRadius: 3,
      pointHoverRadius: 5,
    },
  ];

  if (targetWeight !== null) {
    datasets.push({
      label: "目標体重 (kg)",
      data: records.map(() => targetWeight),
      borderColor: "#FF9BAA",
      backgroundColor: "#FF9BAA",
      yAxisID: "y-weight",
      tension: 0,
      pointRadius: 0,
      pointHoverRadius: 0,
    });
  }

  const data = { labels, datasets };

  const weights = records.map((r) => r.weight);
  const fats = records.map((r) => r.fat).filter((f): f is number => f !== null);

  const allWeights = targetWeight !== null ? [...weights, targetWeight] : weights;
  const weightMin = Math.floor(Math.min(...allWeights) - 2);
  const weightMax = Math.ceil(Math.max(...allWeights) + 2);
  const fatMin = fats.length > 0 ? Math.floor(Math.min(...fats) - 2) : 20;
  const fatMax = fats.length > 0 ? Math.ceil(Math.max(...fats) + 2) : 40;

  const monthBorderPlugin = useMemo(() => ({
    id: "monthBorder",
    afterDraw(chart: ChartJS) {
      const { ctx, chartArea, scales } = chart;
      const xScale = scales["x"];
      if (!xScale || !chartArea) return;

      ctx.save();
      ctx.strokeStyle = "rgba(255, 100, 100, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);

      monthBorders.forEach((borderIndex) => {
        const x = xScale.getPixelForValue(borderIndex);
        if (x >= chartArea.left && x <= chartArea.right) {
          ctx.beginPath();
          ctx.moveTo(x, chartArea.top);
          ctx.lineTo(x, chartArea.bottom);
          ctx.stroke();
        }
      });

      ctx.restore();
    },
  }), [monthBorders]);

  const pointWidth = 50;
  const chartWidth = Math.max(records.length * pointWidth, 300);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      "y-weight": {
        type: "linear" as const,
        position: "left" as const,
        min: weightMin,
        max: weightMax,
        ticks: {
          callback: (value: number | string) => `${value}kg`,
          font: { size: 11 },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.08)",
        },
      },
      "y-fat": {
        type: "linear" as const,
        position: "right" as const,
        min: fatMin,
        max: fatMax,
        ticks: {
          callback: (value: number | string) => `${value}%`,
          font: { size: 11 },
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        ticks: {
          font: { size: 11 },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.08)",
        },
      },
    },
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      data-chart-scroll
      className="h-[calc(100vh-220px)] overflow-x-auto overflow-y-hidden overscroll-x-contain"
    >
      {isLoadingMore && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 z-10">
          読み込み中...
        </div>
      )}
      <div style={{ width: `${chartWidth}px`, height: "100%" }}>
        <Line data={data} options={options} plugins={[monthBorderPlugin]} />
      </div>
    </div>
  );
}