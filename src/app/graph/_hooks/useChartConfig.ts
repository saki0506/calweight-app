import { useMemo } from "react";
import { Chart as ChartJS } from "chart.js";
import { format, parseISO, getMonth } from "date-fns";
import type { GraphRecord } from "./useGraphRecords";

export function useChartConfig(records: GraphRecord[], targetWeight: number | null) {
  const labels = useMemo(
    () => records.map((r) => format(parseISO(r.date), "M/d")),
    [records]
  );

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

  const { weightMin, weightMax, fatMin, fatMax } = useMemo(() => {
    const weights = records.map((r) => r.weight);
    const fats = records.map((r) => r.fat).filter((f): f is number => f !== null);
    const allWeights = targetWeight !== null ? [...weights, targetWeight] : weights;

    return {
      weightMin: Math.floor(Math.min(...allWeights) - 2),
      weightMax: Math.ceil(Math.max(...allWeights) + 2),
      fatMin: fats.length > 0 ? Math.floor(Math.min(...fats) - 2) : 20,
      fatMax: fats.length > 0 ? Math.ceil(Math.max(...fats) + 2) : 40,
    };
  }, [records, targetWeight]);

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

  return {
    labels,
    weightMin,
    weightMax,
    fatMin,
    fatMax,
    monthBorderPlugin,
  };
}