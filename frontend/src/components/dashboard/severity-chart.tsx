"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  DONUT_CHART_SIZE,
  SEVERITY_CHART_COLORS,
  CHART_TOOLTIP_STYLE,
} from "@/lib/charts/config";

interface SeverityChartProps {
  data: Record<string, number>;
}

export function SeverityChart({ data }: SeverityChartProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));
  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-border">
      <div className="border-b border-border px-5 py-3.5">
        <h3 className="text-sm font-semibold">Severity Breakdown</h3>
      </div>
      <div className="flex items-center gap-6 p-5">
        <div className="relative shrink-0" style={{ width: DONUT_CHART_SIZE, height: DONUT_CHART_SIZE }}>
          <ResponsiveContainer width={DONUT_CHART_SIZE} height={DONUT_CHART_SIZE}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                dataKey="value"
                strokeWidth={2}
                stroke="oklch(0.17 0.02 258)"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={SEVERITY_CHART_COLORS[entry.name] || "#888"}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-2xl font-bold tabular-nums">
              {total.toLocaleString()}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Total
            </span>
          </div>
        </div>

        <div className="space-y-3 flex-1">
          {chartData.map((entry) => {
            const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0;
            return (
              <div key={entry.name} className="flex items-center gap-3">
                <div
                  className="size-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      SEVERITY_CHART_COLORS[entry.name] || "#888",
                  }}
                />
                <div className="flex flex-1 items-center justify-between">
                  <span className="text-sm text-foreground/80">
                    {entry.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">
                      {entry.value}
                    </span>
                    <span className="font-mono text-[10px] tabular-nums text-muted-foreground/60">
                      {pct}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
