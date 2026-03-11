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

const CHART_COLORS = [
  "oklch(0.75 0.15 200)",
  "oklch(0.7 0.15 160)",
  "oklch(0.75 0.18 85)",
  "oklch(0.65 0.22 25)",
  "oklch(0.6 0.18 300)",
  "oklch(0.65 0.2 230)",
];

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
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} barCategoryGap="20%">
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="oklch(0.5 0 0 / 0.1)"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "oklch(0.5 0.02 260)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "oklch(0.5 0.02 260)" }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.17 0.02 258)",
                border: "1px solid oklch(0.25 0.025 258)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "oklch(0.93 0.01 250)",
              }}
              cursor={{ fill: "oklch(0.5 0 0 / 0.05)" }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
