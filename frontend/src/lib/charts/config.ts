/** Shared Recharts styling and defaults for dashboard charts (CDAE-0016). */

export const CHART_TOOLTIP_STYLE = {
  backgroundColor: "oklch(0.17 0.02 258)",
  border: "1px solid oklch(0.25 0.025 258)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "oklch(0.93 0.01 250)",
} as const;

export const CHART_GRID_STROKE = "oklch(0.5 0 0 / 0.1)";

export const CHART_AXIS_TICK = {
  fontSize: 11,
  fill: "oklch(0.5 0.02 260)",
} as const;

export const CHART_CURSOR_FILL = "oklch(0.5 0 0 / 0.05)";

export const CRACK_TYPE_BAR_COLORS = [
  "oklch(0.75 0.15 200)",
  "oklch(0.7 0.15 160)",
  "oklch(0.75 0.18 85)",
  "oklch(0.65 0.22 25)",
  "oklch(0.6 0.18 300)",
  "oklch(0.65 0.2 230)",
] as const;

export const SEVERITY_CHART_COLORS: Record<string, string> = {
  Low: "oklch(0.72 0.19 155)",
  Medium: "oklch(0.8 0.17 85)",
  High: "oklch(0.7 0.2 50)",
  Critical: "oklch(0.63 0.24 25)",
};

/** Default bar chart height inside dashboard cards. */
export const BAR_CHART_HEIGHT = 260;

/** Donut chart pixel size (matches Tailwind `size-48`). */
export const DONUT_CHART_SIZE = 192;
