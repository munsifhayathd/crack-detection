"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  BAR_CHART_HEIGHT,
  CHART_AXIS_TICK,
  CHART_CURSOR_FILL,
  CHART_GRID_STROKE,
  CHART_TOOLTIP_STYLE,
  CRACK_TYPE_BAR_COLORS,
} from "@/lib/charts/config";

interface CrackTypeChartProps {
  data: Record<string, number>;
}

export function CrackTypeChart({ data }: CrackTypeChartProps) {
  const chartData = Object.entries(data).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-border">
      <div className="border-b border-border px-5 py-3.5">
        <h3 className="text-sm font-semibold">Crack Type Distribution</h3>
      </div>
      <div className="p-5">
        <ResponsiveContainer width="100%" height={BAR_CHART_HEIGHT}>
          <BarChart data={chartData} barCategoryGap="20%">
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={CHART_GRID_STROKE}
            />
            <XAxis
              dataKey="name"
              tick={CHART_AXIS_TICK}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={CHART_AXIS_TICK}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={CHART_TOOLTIP_STYLE}
              cursor={{ fill: CHART_CURSOR_FILL }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={CRACK_TYPE_BAR_COLORS[i % CRACK_TYPE_BAR_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
